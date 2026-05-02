"use client";

/**
 * AuthProvider — single source of truth for the current user on the client.
 *
 * Bootstrap path:
 *   1. Server-rendered root layout calls getCurrentUser() and passes the
 *      result into <AuthProvider initialUser={...}>.
 *   2. Client never refetches /me on its own. State updates happen via the
 *      action methods (login, signupComplete, resetPassword, logout) and
 *      through forced refresh() if a 401 leaks past.
 *
 * Concurrent-call dedup: refresh() shares one in-flight /me promise so two
 * components mounting simultaneously hit the API at most once.
 */

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { ApiError } from "@/lib/api-client";
import {
  type CurrentUser,
  getMe,
  login as loginApi,
  logout as logoutApi,
} from "@/lib/api/auth";

type Status = "authenticated" | "unauthenticated" | "loading";

interface AuthContextValue {
  user: CurrentUser | null;
  status: Status;
  /** Force-refresh from /v1/auth/me. Dedupes concurrent calls. */
  refresh: () => Promise<CurrentUser | null>;
  /** Email + password sign-in. Updates context on success. */
  login: (email: string, password: string) => Promise<CurrentUser>;
  /** Manually push a user (used by signupComplete, forgotPasswordReset). */
  setUser: (user: CurrentUser | null) => void;
  /**
   * Patch the current user with a partial. Used for surgical updates after a
   * profile save — the server returns only the fields that changed; we splice
   * them in without a /v1/auth/me refetch. No-op if no user is signed in.
   */
  updateUser: (patch: Partial<CurrentUser>) => void;
  /** Server-side logout + clear context. */
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({
  initialUser,
  children,
}: {
  initialUser: CurrentUser | null;
  children: ReactNode;
}) {
  const [user, setUserState] = useState<CurrentUser | null>(initialUser);
  const [status, setStatus] = useState<Status>(
    initialUser ? "authenticated" : "unauthenticated",
  );
  const inflight = useRef<Promise<CurrentUser | null> | null>(null);

  const setUser = useCallback((next: CurrentUser | null) => {
    setUserState(next);
    setStatus(next ? "authenticated" : "unauthenticated");
  }, []);

  const updateUser = useCallback((patch: Partial<CurrentUser>) => {
    setUserState((cur) => (cur ? { ...cur, ...patch } : cur));
  }, []);

  const refresh = useCallback(async (): Promise<CurrentUser | null> => {
    if (inflight.current) return inflight.current;
    setStatus("loading");
    const promise = (async () => {
      try {
        const { user: fetched } = await getMe();
        setUser(fetched);
        return fetched;
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          setUser(null);
          return null;
        }
        // Network blip etc — keep last known state, just stop showing loading.
        setStatus(user ? "authenticated" : "unauthenticated");
        throw err;
      } finally {
        inflight.current = null;
      }
    })();
    inflight.current = promise;
    return promise;
  }, [setUser, user]);

  const doLogin = useCallback(
    async (email: string, password: string): Promise<CurrentUser> => {
      const { user: fresh } = await loginApi(email, password);
      setUser(fresh);
      return fresh;
    },
    [setUser],
  );

  const doLogout = useCallback(async () => {
    try {
      await logoutApi();
    } finally {
      setUser(null);
    }
  }, [setUser]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      status,
      refresh,
      login: doLogin,
      setUser,
      updateUser,
      logout: doLogout,
    }),
    [user, status, refresh, doLogin, setUser, updateUser, doLogout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

/**
 * Action gate for client-side buttons that require auth — e.g. "Unlock $3"
 * on a public idea card. Returns a function that:
 *   - if logged in: invokes `onAuthed`
 *   - if not:     redirects to /login?next={current path}
 */
export function useRequireAuth() {
  const { user } = useAuth();
  return useCallback(
    (
      action: () => void | Promise<void>,
      router: { push: (url: string) => void },
      currentPath: string,
    ) => {
      if (user) {
        return action();
      }
      const next = encodeURIComponent(currentPath);
      router.push(`/login?next=${next}`);
    },
    [user],
  );
}

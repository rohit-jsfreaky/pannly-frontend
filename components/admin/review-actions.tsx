"use client";

import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api-client";
import { approveBuild, rejectBuild } from "@/lib/api/admin";

interface Props {
  unlockId: string;
}

type Mode = "idle" | "approving" | "rejecting";

/**
 * Approve / Reject UI for the build detail screen.
 *
 * Approve has a confirmation step (single-click refund is dangerous).
 * Reject opens a textarea for the rejection reason — backend rejects
 * empty / <3-char reasons.
 *
 * On success, redirects back to the queue. The queue is server-rendered
 * with `force-dynamic` so it'll re-fetch and the row disappears.
 */
export function ReviewActions({ unlockId }: Props) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("idle");
  const [confirming, setConfirming] = useState<"approve" | null>(null);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [issueRefund, setIssueRefund] = useState(true);

  const onApprove = async () => {
    if (mode !== "idle") return;
    setMode("approving");
    try {
      const res = await approveBuild(unlockId, {
        notes: null,
        issue_refund: issueRefund,
      });
      toast.success(
        issueRefund
          ? "Approved. Refund queued — webhook will flip to refunded."
          : "Approved without refund.",
        { description: `New state: ${res.state}` },
      );
      router.push("/admin/builds" as Route);
      router.refresh();
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Approve failed. Try again.",
      );
      setMode("idle");
    }
  };

  const onReject = async () => {
    if (mode !== "idle") return;
    if (reason.trim().length < 3) {
      toast.error("Reason must be at least 3 characters.");
      return;
    }
    setMode("rejecting");
    try {
      await rejectBuild(unlockId, reason.trim());
      toast.success("Rejected. The user will see this on their draft page.");
      router.push("/admin/builds" as Route);
      router.refresh();
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Reject failed. Try again.",
      );
      setMode("idle");
    }
  };

  // ----- Reject panel ----------------------------------------------- //
  if (rejectOpen) {
    return (
      <div className="flex flex-col gap-4 rounded-xl border border-plum-300/60 bg-plum-100/20 p-5">
        <div>
          <h3 className="font-display text-lg text-ink-700">
            Reject this build
          </h3>
          <p className="mt-1 text-xs text-ink-50">
            The user sees this reason on their draft page. Be specific — they
            can&apos;t resubmit (rejection is terminal in the current state
            machine).
          </p>
        </div>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={4}
          maxLength={500}
          placeholder="e.g. The submitted URL returns a 404 and the screenshot doesn't match the brief."
          className="w-full rounded-lg border border-cream-300 bg-cream-50 px-3 py-2 text-sm text-ink-700 placeholder:text-cream-400 focus:border-plum-500 focus:outline-none focus:ring-2 focus:ring-plum-500/30"
        />
        <p className="text-right font-mono text-[10px] text-cream-400">
          {reason.length} / 500
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={onReject}
            loading={mode === "rejecting"}
            disabled={mode !== "idle" || reason.trim().length < 3}
          >
            Confirm reject
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setRejectOpen(false);
              setReason("");
            }}
            disabled={mode !== "idle"}
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  // ----- Approve confirmation panel --------------------------------- //
  if (confirming === "approve") {
    return (
      <div className="flex flex-col gap-4 rounded-xl border border-moss-600/40 bg-moss-100/30 p-5">
        <div>
          <h3 className="font-display text-lg text-ink-700">
            Confirm approval
          </h3>
          <p className="mt-1 text-xs text-ink-50">
            {issueRefund
              ? "This will fire a refund through Dodo. The unlock state flips to approved now, then to refunded once the refund.succeeded webhook arrives."
              : "Approving WITHOUT issuing a refund. The user keeps the brief but does not get their $3 back."}
          </p>
        </div>
        <label className="flex items-start gap-2 text-sm text-ink-700">
          <input
            type="checkbox"
            checked={issueRefund}
            onChange={(e) => setIssueRefund(e.target.checked)}
            className="mt-0.5 h-4 w-4 cursor-pointer accent-moss-600"
          />
          <span>
            <strong>Issue $3 refund</strong> (uncheck for an edge-case approve
            without refund)
          </span>
        </label>
        <div className="flex flex-wrap gap-2">
          <Button onClick={onApprove} loading={mode === "approving"}>
            {issueRefund ? "Approve & refund" : "Approve only"}
          </Button>
          <Button
            variant="secondary"
            onClick={() => setConfirming(null)}
            disabled={mode !== "idle"}
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  // ----- Default action row ----------------------------------------- //
  return (
    <div className="flex flex-wrap gap-3">
      <Button
        size="lg"
        onClick={() => setConfirming("approve")}
        disabled={mode !== "idle"}
      >
        Approve & refund
      </Button>
      <Button
        size="lg"
        variant="secondary"
        onClick={() => setRejectOpen(true)}
        disabled={mode !== "idle"}
      >
        Reject
      </Button>
    </div>
  );
}

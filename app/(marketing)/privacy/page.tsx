import { LegalPage } from "@/components/legal/legal-page";
import { pageMetadata } from "@/lib/seo/page-metadata";
import { buildBreadcrumbSchema, schemaJson } from "@/lib/seo/schemas";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  path: "/privacy",
  description:
    "What data Pannly collects, how we use it, who we share it with, and your rights.",
});

const BREADCRUMB = buildBreadcrumbSchema([
  { name: "Privacy Policy", path: "/privacy" },
]);

/**
 * /privacy — Privacy Policy.
 *
 * Anchored on the actual implementation:
 *   - User table fields (email, display_name, avatar_url, hashed password,
 *     usage flags, Dodo customer ID)
 *   - Build artefacts in R2 (avatars, build screenshots)
 *   - Resend for transactional email
 *   - Dodo Payments for billing
 *   - Plausible analytics is wired in code but currently disabled at
 *     runtime — phrased conservatively here.
 *   - bcrypt password hashing
 *   - Single session cookie (HMAC-signed, 30-day rolling, HttpOnly + Secure)
 */
export default function PrivacyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemaJson(BREADCRUMB) }}
      />
    <LegalPage
      title="Privacy Policy"
      lastUpdated="May 3, 2026"
      intro={
        <p>
          This Privacy Policy explains what data Pannly (
          <strong>pannly.getrevlio.com</strong>) collects, why, and how we
          handle it. It applies to anyone visiting the site, creating an
          account, or paying for a brief or Pro subscription.
        </p>
      }
    >
      <h2>The TL;DR</h2>
      <ul>
        <li>
          We collect what we need to run a paid idea-brief service: your
          email, display name, avatar (optional), and a record of what
          you've unlocked or shipped.
        </li>
        <li>We don't sell your data.</li>
        <li>We don't run third-party advertising trackers or marketing pixels.</li>
        <li>
          We use one session cookie to keep you signed in. No cross-site
          tracking.
        </li>
        <li>
          You can ask for a copy of your data or for it to be deleted by
          emailing <a href="mailto:support@getrevlio.com">support@getrevlio.com</a>.
        </li>
      </ul>

      <h2>1. What we collect</h2>

      <h3>Account data</h3>
      <ul>
        <li>Your email address.</li>
        <li>Your display name (optional, but recommended).</li>
        <li>Your avatar image (optional).</li>
        <li>
          A bcrypt hash of your password — never stored, transmitted, or
          logged in clear text.
        </li>
        <li>
          Account flags: when you joined, your last login time, whether
          your email is verified, your Pro subscription status, and an
          internal admin flag we use for ourselves.
        </li>
      </ul>

      <h3>Usage data</h3>
      <ul>
        <li>
          Which idea briefs you've unlocked or claimed via Pro, and the
          state of each (unlocked, building, submitted, approved, refunded,
          rejected).
        </li>
        <li>
          Build artefacts you submit when claiming a refund: the live URL,
          a screenshot (stored on Cloudflare R2), product name, optional
          category, and any write-up you provide.
        </li>
        <li>
          Server access logs (request line, status code, IP, user-agent)
          rotated every 14 days, used for security and debugging.
        </li>
      </ul>

      <h3>Payment data</h3>
      <ul>
        <li>
          We use <strong>Dodo Payments</strong> to process every transaction.
          Dodo handles your card details directly — we never see them.
        </li>
        <li>
          We store the Dodo customer ID, payment IDs, amounts, currency,
          status, refund status, and minimal event metadata. This is what
          we need to power the customer portal, issue refunds, and keep
          accurate records.
        </li>
      </ul>

      <h3>Communications</h3>
      <p>
        If you write to <a href="mailto:support@getrevlio.com">support@getrevlio.com</a>{" "}
        or use the in-app contact form, we keep the message and your email
        address so we can reply and follow up.
      </p>

      <h3>What we don't collect</h3>
      <ul>
        <li>We don't ask for your phone number, postal address, or government ID.</li>
        <li>
          We don't run third-party advertising tags (no Google Ads, Meta
          Pixel, LinkedIn Insight Tag, TikTok Pixel, or similar).
        </li>
        <li>We don't fingerprint browsers.</li>
      </ul>

      <h2>2. How we use your data</h2>
      <ul>
        <li>
          <strong>Run the service.</strong> Authenticate your sessions, show
          your unlocks and submitted builds, gate briefs by access tier.
        </li>
        <li>
          <strong>Process payments.</strong> Tell Dodo who's paying and
          what for; receive webhooks back to track outcome.
        </li>
        <li>
          <strong>Send transactional email.</strong> Sign-up verification
          codes, password reset codes, refund confirmations, build review
          decisions. Sent through <strong>Resend</strong>.
        </li>
        <li>
          <strong>Public surfaces.</strong> When we approve a shipped build,
          your build name, your display name (or initials only if you
          haven't set a display name), and the live URL appear on the
          public <code>/built</code> gallery and the public refund ledger
          on <code>/refunds</code>. Your email never appears on the public
          site.
        </li>
        <li>
          <strong>Service improvement.</strong> Aggregated counts of what's
          getting unlocked, refund rates, and signal acceptance — to
          improve our scoring and brief generation.
        </li>
        <li>
          <strong>Security and fraud prevention.</strong> Detect and block
          abuse and fraudulent refund attempts.
        </li>
      </ul>
      <p>
        We do <strong>not</strong> use your personal data to train AI
        models. The LLM passes that filter signals and write briefs only
        see public Reddit and Hacker News content — never your account
        data, your build write-ups, or your communications.
      </p>

      <h2>3. Who we share data with</h2>
      <p>
        We share the minimum necessary with these third-party processors,
        each used for a specific purpose:
      </p>
      <ul>
        <li>
          <strong>Dodo Payments</strong> (payments) — receives the data you
          enter at checkout plus transaction metadata so we can charge you
          and issue refunds.
        </li>
        <li>
          <strong>Resend</strong> (transactional email) — receives your
          email address and the email body when we send you a transactional
          message.
        </li>
        <li>
          <strong>Cloudflare R2</strong> (object storage) — your avatar and
          build screenshots are stored on R2's S3-compatible storage.
        </li>
        <li>
          <strong>Cloudflare</strong> (CDN and DNS) — sits in front of
          every request. Cloudflare logs are short-lived.
        </li>
        <li>
          <strong>OpenRouter</strong> (LLM API gateway) and{" "}
          <strong>Voyage AI</strong> (embeddings) — receive only public
          Reddit and Hacker News post content for filtering and brief
          generation. We do not send them user account data, build
          artefacts, or contact-form messages.
        </li>
        <li>
          <strong>Plausible Analytics</strong> — if and when we enable
          analytics, we use Plausible. Plausible doesn't use cookies,
          doesn't store full IPs, and doesn't track you across sites. We
          aggregate page-view counts only.
        </li>
      </ul>
      <p>
        We don't sell, rent, or trade your personal data. We will only
        disclose data to law enforcement if compelled by a valid legal
        request, and we'll push back on overly broad requests where the
        law allows.
      </p>

      <h2>4. Cookies</h2>
      <p>Pannly uses one cookie:</p>
      <ul>
        <li>
          <code>pannly_session</code> — an HMAC-signed session token.{" "}
          <strong>HttpOnly</strong>, <strong>Secure</strong> in production,{" "}
          <strong>SameSite=Lax</strong>, with a 30-day rolling expiry. The
          actual session payload lives server-side in Redis; the cookie
          carries only an opaque signed reference. We need this to keep
          you signed in.
        </li>
      </ul>
      <p>We don't use marketing or advertising cookies.</p>

      <h2>5. Data retention</h2>
      <ul>
        <li>
          <strong>Account data</strong> is kept for as long as your account
          exists. After account closure we delete or anonymise it within
          30 days.
        </li>
        <li>
          <strong>Build artefacts on /built</strong> are retained
          indefinitely as part of the public ledger. The build name, your
          display name (or initials), and the live URL stay visible even
          after you close your account — this is the trade you make when
          you publish to a public gallery.
        </li>
        <li>
          <strong>Payment records</strong> are retained for 7 years to
          comply with tax and accounting law.
        </li>
        <li>
          <strong>Email logs</strong> at our email provider (Resend) are
          retained per their own policy — typically around 30 days.
        </li>
        <li>
          <strong>Server access logs</strong> rotate every 14 days.
        </li>
      </ul>

      <h2>6. Your rights</h2>
      <p>You can ask us to:</p>
      <ul>
        <li><strong>Access</strong> the personal data we hold about you.</li>
        <li><strong>Correct</strong> inaccurate information.</li>
        <li>
          <strong>Delete</strong> your account and the personal data tied
          to it, subject to the retention limits above.
        </li>
        <li>
          <strong>Export</strong> your data in a machine-readable format
          (JSON).
        </li>
        <li>
          <strong>Object</strong> to or restrict certain uses (e.g. analytics).
        </li>
      </ul>
      <p>
        Email <a href="mailto:support@getrevlio.com">support@getrevlio.com</a>{" "}
        to exercise any of these. We respond within 30 days.
      </p>
      <p>
        If you're in the EU or UK, you also have the right to lodge a
        complaint with your local data protection authority. If you're in
        India, you can contact the Data Protection Board.
      </p>

      <h2>7. International transfers</h2>
      <p>
        Pannly is operated from India. Several of our processors (Dodo
        Payments, Resend, Cloudflare, OpenRouter, Voyage AI) are
        headquartered outside India, primarily in the US and EU. Your data
        may be transferred to and processed in those regions. We rely on
        each processor's stated transfer safeguards (Standard Contractual
        Clauses or equivalent) where required by law.
      </p>

      <h2>8. Children</h2>
      <p>
        Pannly is not directed at children under 16. We don't knowingly
        collect data from minors. If you believe a minor has registered an
        account, email us and we'll delete it.
      </p>

      <h2>9. Security</h2>
      <p>
        We use industry-standard practices: TLS for all traffic, bcrypt
        password hashing, HttpOnly + Secure session cookies, server-side
        session storage in Redis, scoped API keys for every third-party
        service, CSRF-lite checks on every mutating request. No system is
        perfectly secure — if a breach affects your data, we'll notify you
        within 72 hours of discovery.
      </p>

      <h2>10. Changes to this policy</h2>
      <p>
        We may update this Privacy Policy. Material changes will be
        announced by email and posted here at least 14 days before they
        take effect. The "Last updated" date at the top reflects the most
        recent revision.
      </p>

      <h2>11. Contact</h2>
      <p>
        Privacy questions, deletion requests, or anything else:{" "}
        <a href="mailto:support@getrevlio.com">support@getrevlio.com</a>.
      </p>
    </LegalPage>
    </>
  );
}

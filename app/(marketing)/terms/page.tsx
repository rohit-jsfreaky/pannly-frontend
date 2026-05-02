import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms that govern your use of Pannly — accounts, pricing, refunds, content, and how disputes work.",
  alternates: { canonical: "/terms" },
  openGraph: { url: "/terms" },
};

/**
 * /terms — Terms of Service.
 *
 * Anchored on what Pannly actually does today (per-unlock briefs at $3 /
 * premium $5, $15/mo Pro, 30-day refund-on-ship via admin approval, payments
 * via Dodo, hosted from India). No fabricated entity status, no claims of
 * compliance certifications we don't have.
 */
export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      lastUpdated="May 3, 2026"
      intro={
        <p>
          These Terms govern your use of <strong>pannly.getrevlio.com</strong>{" "}
          and any related services we operate. By creating an account or using
          Pannly, you agree to them. If you don't, please don't use the service.
        </p>
      }
    >
      <h2>1. About Pannly</h2>
      <p>
        Pannly is an indie product that surfaces software-startup ideas from
        public posts on Reddit and Hacker News, scores them, and writes
        structured briefs. Briefs are sold individually for a small fee or
        unlimited via a monthly subscription. Builders who ship a working
        product within 30 days of unlocking a brief get the per-unlock fee
        refunded automatically after admin review.
      </p>
      <p>
        Pannly is operated as an indie project, not a registered company.
        References to <em>"Pannly," "we," "us,"</em> or <em>"our"</em> mean
        the operator of the service. References to <em>"you"</em> mean the
        person or entity using the service.
      </p>

      <h2>2. Eligibility</h2>
      <p>
        You must be at least 16 years old to use Pannly. By using the service
        you confirm you meet that requirement and have the legal capacity to
        enter into this agreement.
      </p>

      <h2>3. Your Account</h2>
      <ul>
        <li>
          You're responsible for keeping your password secure. We hash
          passwords with bcrypt — we never see them in clear text.
        </li>
        <li>
          Provide accurate information when you sign up. We use your email
          for transactional notices: signup verification, password resets,
          and refund confirmations.
        </li>
        <li>One person, one account. Don't share accounts.</li>
        <li>
          We may suspend or close accounts for material breach of these
          Terms, fraud, or abuse, with notice where reasonably possible.
        </li>
      </ul>

      <h2>4. The Service</h2>
      <p>Pannly currently offers three tiers:</p>
      <ul>
        <li>
          <strong>Free.</strong> Browse the public idea feed, see scored
          previews, view the build gallery and refund ledger.
        </li>
        <li>
          <strong>Per-unlock briefs.</strong> $3 USD for a single brief, or
          $5 USD for premium-scored briefs (overall score ≥ 85). Each brief
          contains: a structured pain analysis, evidence quotes with source
          URLs to the original Reddit/HN posts, a 3-step validation plan,
          buyer personas, and sample landing copy.
        </li>
        <li>
          <strong>Pro plan.</strong> $15 USD per month. Read access to every
          brief. Cancel anytime through the customer portal.
        </li>
      </ul>
      <p>
        We may add, remove, or change features. Material changes that
        materially worsen the value you receive will be communicated by
        email at least 14 days in advance where reasonably possible.
      </p>

      <h2>5. Refund-on-ship guarantee</h2>
      <p>
        For per-unlock briefs only:
      </p>
      <ul>
        <li>
          Submit a working live URL plus a screenshot within{" "}
          <strong>30 days of your unlock</strong>. We review submissions
          manually and respond within 24–48 hours.
        </li>
        <li>
          If we approve, we issue a refund to your original payment method
          via our payment processor. Settlement times depend on your card
          issuer (typically 3–10 business days).
        </li>
        <li>
          Approval is at our reasonable discretion. We reject placeholder
          pages, "coming soon" landing pages, sites that aren't publicly
          accessible, sites behind required authentication, or sites that
          don't credibly address the unlocked idea.
        </li>
        <li>
          One refund per unlocked brief. Resubmissions of rejected builds
          are at our discretion.
        </li>
      </ul>
      <p>
        For Pro subscriptions: cancel anytime. We don't pro-rate refunds —
        you keep access until the end of the period you paid for. Outside
        the conditions above, all sales are final.
      </p>

      <h2>6. Payments</h2>
      <ul>
        <li>
          Payments are processed by <strong>Dodo Payments</strong>. We don't
          store card details. We see only what Dodo passes back: transaction
          IDs, status, amount, currency, and a customer ID for portal
          access.
        </li>
        <li>
          Default currency is USD. Indian users are billed in INR based on
          country detection at checkout. The displayed price is what you
          pay (excluding any taxes covered below).
        </li>
        <li>
          You're responsible for any taxes (GST, VAT, sales tax) imposed by
          your jurisdiction unless our payment processor or the law requires
          us to collect them on your behalf.
        </li>
      </ul>

      <h2>7. Your content</h2>
      <p>
        "Your Content" means anything you submit through Pannly — your
        display name, avatar image, build URLs, build screenshots, build
        write-ups, and any text you send through the contact form.
      </p>
      <ul>
        <li>You keep all rights to Your Content.</li>
        <li>
          You grant Pannly a worldwide, non-exclusive, royalty-free licence
          to host, display, and distribute Your Content as necessary to
          operate the service. For approved builds, this licence covers
          public display on the <code>/built</code> gallery and the public
          refund ledger.
        </li>
        <li>
          You confirm you have the rights to submit any content you submit
          and that it doesn't infringe anyone else's rights.
        </li>
        <li>
          We may remove content that violates these Terms, breaks the law,
          or is reasonably objectionable.
        </li>
      </ul>

      <h2>8. Pannly's content</h2>
      <ul>
        <li>
          Idea briefs are licensed to you for personal and commercial use as
          long as you've unlocked them or hold an active Pro subscription.
          You can build the products described, use the landing copy on
          your own site, and quote from the brief externally with
          attribution.
        </li>
        <li>
          You may not resell or redistribute briefs as a product, build a
          competing brief-generation service that pulls from our briefs, or
          scrape our content at scale.
        </li>
        <li>
          The Pannly name, logo, design, and code are our intellectual
          property.
        </li>
      </ul>

      <h2>9. Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Scrape, mirror, or redistribute Pannly content at scale.</li>
        <li>Bypass paywalls, rate limits, or auth checks.</li>
        <li>Use Pannly to harass, defame, or violate anyone's rights.</li>
        <li>Submit illegal, fraudulent, or hateful content.</li>
        <li>Reverse-engineer, decompile, or interfere with the service.</li>
        <li>Submit fake build URLs to fraudulently obtain refunds.</li>
      </ul>
      <p>We reserve the right to terminate access for any of the above.</p>

      <h2>10. Disclaimers</h2>
      <p>
        Pannly is provided <strong>"as is"</strong> and{" "}
        <strong>"as available."</strong> Idea briefs are research outputs,
        not investment advice or a guarantee of business success. Whether
        you make money from a brief is on you. We don't warrant the
        accuracy, completeness, or fitness for any particular purpose of
        any brief.
      </p>
      <p>
        Evidence quotes attributed to Reddit/HN posts are paraphrased
        summaries with source links — we make a good-faith effort to
        represent the underlying signal accurately, but we don't warrant
        the quotes are verbatim or that source posts will remain accessible.
      </p>

      <h2>11. Limitation of liability</h2>
      <p>
        To the maximum extent permitted by law, Pannly's total liability for
        any claim arising out of or relating to these Terms or your use of
        the service is limited to the greater of{" "}
        <strong>(a) the amount you paid Pannly in the 12 months preceding
        the claim</strong> or <strong>(b) US $50</strong>.
      </p>
      <p>
        We are not liable for indirect, incidental, special, consequential,
        or punitive damages, including lost profits, lost business, or lost
        data.
      </p>

      <h2>12. Termination</h2>
      <p>
        You can close your account at any time by emailing{" "}
        <a href="mailto:support@getrevlio.com">support@getrevlio.com</a>{" "}
        (self-service deletion is on the roadmap). When you close your
        account we delete or anonymise your personal data within a
        reasonable time, subject to the retention rules in our Privacy
        Policy. Build artefacts already published on the public gallery
        remain visible — they're part of the public record of shipped work.
      </p>

      <h2>13. Changes to these Terms</h2>
      <p>
        We may update these Terms over time. Material changes will be
        announced by email and posted here at least 14 days before they
        take effect. Continued use after the effective date counts as
        acceptance.
      </p>

      <h2>14. Governing law</h2>
      <p>
        These Terms are governed by the laws of India. Any dispute will be
        resolved by the courts located in Delhi, India, unless mandatory
        consumer-protection law in your jurisdiction grants you a different
        forum.
      </p>

      <h2>15. Contact</h2>
      <p>
        Questions, complaints, or refund requests:{" "}
        <a href="mailto:support@getrevlio.com">support@getrevlio.com</a>.
      </p>
    </LegalPage>
  );
}

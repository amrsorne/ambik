import { createFileRoute } from '@tanstack/react-router'
import LegalShell from '../components/legal/LegalShell'

export const Route = createFileRoute('/privacy')({
  component: PrivacyPage,
  head: () => ({ meta: [{ title: 'Privacy Policy — Ambik' }] }),
})

function PrivacyPage() {
  return (
    <LegalShell title="Privacy Policy">
      <p>
        <strong>Last updated:</strong> November 2026
      </p>
      <p>
        Ambik (
        <a href="https://ambik.link" className="text-[var(--color-brand-strong)] underline">
          ambik.link
        </a>
        ) hosts experiments and links to companion products. This policy describes what
        we collect on this site and how we use it.
      </p>
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Information we collect</h2>
        <p>
          When you join a waitlist or submit a form on a linked product, we may collect your
          email address and optional details you provide. We also receive standard server and
          analytics logs to keep the service reliable and secure. Our public{' '}
          <a href="/stats" className="text-[var(--color-brand-strong)] underline">
            stats page
          </a>{' '}
          shows only aggregate counts (for example waitlist totals and country-level
          hub traffic), not individual signups or email addresses.
        </p>
      </section>
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">How we use information</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>Operate and improve Ambik and linked services</li>
          <li>Send product updates you asked for</li>
          <li>Prevent abuse, spam, and security incidents</li>
          <li>Comply with law where required</li>
        </ul>
      </section>
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Sharing</h2>
        <p>
          We do not sell personal data. We use infrastructure providers who process data only
          to deliver the service. Individual Ambik projects may have their own policies when
          you leave this site.
        </p>
      </section>
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Retention &amp; rights</h2>
        <p>
          You may request access, correction, or deletion at{' '}
          <a href="mailto:hello@ambik.link" className="text-[var(--color-brand-strong)] underline">
            hello@ambik.link
          </a>
          . See our PDPA page for Malaysia / GDPR-style rights where applicable.
        </p>
      </section>
    </LegalShell>
  )
}

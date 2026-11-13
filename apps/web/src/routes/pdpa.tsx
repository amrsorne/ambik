import { createFileRoute, Link } from '@tanstack/react-router'
import LegalShell from '../components/legal/LegalShell'

export const Route = createFileRoute('/pdpa')({
  component: PdpaPage,
  head: () => ({ meta: [{ title: 'PDPA & Data Protection — Ambik' }] }),
})

function PdpaPage() {
  return (
    <LegalShell title="PDPA & Data Protection">
      <p>
        <strong>Last updated:</strong> November 2026
      </p>
      <p>
        How Ambik handles personal data under Malaysia&apos;s PDPA 2010 and, where applicable,
        principles aligned with the EU GDPR.
      </p>
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Data controller</h2>
        <p>
          Ambik (operated by Ameer Sorne). Contact:{' '}
          <a href="mailto:hello@ambik.link" className="text-[var(--color-brand-strong)] underline">
            hello@ambik.link
          </a>
        </p>
      </section>
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Your rights</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>Access and obtain a copy of your personal data</li>
          <li>Request correction of inaccurate data</li>
          <li>Withdraw consent where processing is consent-based</li>
          <li>Request deletion when data is no longer needed</li>
        </ul>
      </section>
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Related policies</h2>
        <p>
          <Link to="/privacy" className="text-[var(--color-brand-strong)] underline">
            Privacy Policy
          </Link>
          {' · '}
          <Link to="/terms" className="text-[var(--color-brand-strong)] underline">
            Terms of Service
          </Link>
        </p>
      </section>
    </LegalShell>
  )
}

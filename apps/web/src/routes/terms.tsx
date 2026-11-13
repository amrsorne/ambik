import { createFileRoute } from '@tanstack/react-router'
import LegalShell from '../components/legal/LegalShell'

export const Route = createFileRoute('/terms')({
  component: TermsPage,
  head: () => ({ meta: [{ title: 'Terms of Service — Ambik' }] }),
})

function TermsPage() {
  return (
    <LegalShell title="Terms of Service">
      <p>
        <strong>Last updated:</strong> November 2026
      </p>
      <p>
        By using ambik.link and its linked experiments, you agree to these terms. If you do
        not agree, please do not use the site.
      </p>
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">The service</h2>
        <p>
          Ambik is a directory and launch surface for side projects. Features may change,
          pause, or end without notice. Linked subdomains are separate products.
        </p>
      </section>
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Acceptable use</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>Do not break the law or infringe others&apos; rights</li>
          <li>Do not disrupt, scrape, or overload our systems</li>
          <li>Do not submit false information through waitlists or forms</li>
        </ul>
      </section>
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Disclaimers</h2>
        <p>
          The site and projects are provided &quot;as is&quot; without warranties, to the
          fullest extent permitted by law.
        </p>
      </section>
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Contact</h2>
        <p>
          <a href="mailto:hello@ambik.link" className="text-[var(--color-brand-strong)] underline">
            hello@ambik.link
          </a>
        </p>
      </section>
    </LegalShell>
  )
}

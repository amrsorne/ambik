import type { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import GodRays from '../GodRays'
import SiteFooter from '../SiteFooter'

interface LegalShellProps {
  title: string
  children: ReactNode
}

const LegalShell = ({ title, children }: LegalShellProps) => (
  <div className="relative min-h-screen bg-linear-to-br from-[var(--color-surface)] via-indigo-50 to-violet-100">
    <GodRays />
    <main className="relative z-10 mx-auto max-w-3xl px-4 py-16 pb-28 sm:px-6 lg:px-8">
      <p className="mb-2 text-sm font-medium text-[var(--color-brand-strong)]">
        <Link to="/" className="underline-offset-4 hover:underline">
          Ambik
        </Link>
      </p>
      <h1 className="mb-8 text-3xl font-bold tracking-tight text-[var(--color-ink)] sm:text-4xl">
        {title}
      </h1>
      <article className="space-y-6 text-base leading-relaxed text-[var(--color-ink)]">
        {children}
      </article>
    </main>
    <SiteFooter />
  </div>
)

export default LegalShell

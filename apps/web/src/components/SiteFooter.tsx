import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

const legalLinks = [
  { to: '/privacy' as const, key: 'footer.privacy' as const },
  { to: '/terms' as const, key: 'footer.terms' as const },
  { to: '/pdpa' as const, key: 'footer.pdpa' as const },
]

const SiteFooter = () => {
  const { t } = useTranslation()

  return (
    <footer className="relative z-10 border-t border-[var(--color-border-soft)] bg-[var(--color-surface-elevated)]/80 px-4 py-8 backdrop-blur-md sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed text-[var(--color-ink)]">
          &copy; {new Date().getFullYear()} Ambik — {t('footer.tagline')}
        </p>
        <nav
          className="flex flex-wrap gap-x-6 gap-y-2 text-sm"
          aria-label={t('footer.legalNav')}
        >
          {legalLinks.map(({ to, key }) => (
            <Link
              key={to}
              to={to}
              className="text-[var(--color-ink)] underline-offset-4 hover:text-[var(--color-brand-strong)] hover:underline"
            >
              {t(key)}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}

export default SiteFooter

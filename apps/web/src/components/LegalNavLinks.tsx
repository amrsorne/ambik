import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

const legalRoutes = [
  { to: '/privacy' as const, key: 'footer.privacy' as const },
  { to: '/terms' as const, key: 'footer.terms' as const },
  { to: '/pdpa' as const, key: 'footer.pdpa' as const },
]

type LegalNavLinksProps = {
  className?: string
  linkClassName?: string
}

const LegalNavLinks = ({
  className = '',
  linkClassName = 'text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] underline-offset-4 hover:underline',
}: LegalNavLinksProps) => {
  const { t } = useTranslation()

  return (
    <nav
      className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm ${className}`}
      aria-label={t('footer.legalNav')}
    >
      {legalRoutes.map(({ to, key }) => (
        <Link key={to} to={to} className={linkClassName}>
          {t(key)}
        </Link>
      ))}
    </nav>
  )
}

export default LegalNavLinks

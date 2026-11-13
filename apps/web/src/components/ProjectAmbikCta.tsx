import { ExternalLink, Rocket } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface ProjectAmbikCtaProps {
  href: string
}

const baseButton =
  'mt-3 flex w-full max-w-sm min-h-11 items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-center text-sm font-semibold tracking-tight transition-[background-color,box-shadow,transform] duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'

const ProjectAmbikCta = ({ href }: ProjectAmbikCtaProps) => {
  const { t } = useTranslation()

  return (
    <section className="flex w-full flex-col items-center px-2 pb-1 pt-3">
      <p className="text-center text-sm font-medium text-[var(--color-ink)]">
        {t('cta.heading')}
      </p>
      <p className="mt-1 max-w-xs text-center text-xs leading-relaxed text-[var(--color-ink-muted)]">
        {t('cta.subtitle_live')}
      </p>

      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseButton} bg-[var(--color-brand-strong)] text-white shadow-sm hover:bg-[var(--color-brand)] hover:shadow-md active:scale-[0.99] focus-visible:outline-[var(--color-brand-strong)]`}
      >
        <Rocket className="h-4 w-4 shrink-0" aria-hidden />
        <span>{t('cta.open_label')}</span>
        <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-80" aria-hidden />
        <span className="sr-only">{t('cta.opens_new_tab')}</span>
      </a>
    </section>
  )
}

export default ProjectAmbikCta

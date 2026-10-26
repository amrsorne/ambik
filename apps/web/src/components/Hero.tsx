import { useTranslation } from 'react-i18next'
import type { Card } from '../lib/card-ui'
import { Search } from './Search'

interface HeroProps {
  onCardSelect: (card: Card) => void
}

export const Hero = ({ onCardSelect }: HeroProps) => {
  const { t } = useTranslation()

  return (
    <header className="relative z-10 mx-auto max-w-3xl text-center">
      <h1
        className="text-balance text-3xl font-extrabold leading-tight tracking-tight text-[var(--color-ink)] sm:text-5xl md:text-6xl"
        dangerouslySetInnerHTML={{ __html: t('title') }}
      />

      <p
        className="mt-2 hidden text-balance text-lg text-[var(--color-ink-muted)] sm:block md:text-xl"
        dangerouslySetInnerHTML={{ __html: t('subtitle') }}
      />

      <div className="mx-auto mt-4 w-full max-w-md sm:mt-6">
        <Search onSelect={onCardSelect} />
      </div>

      <p className="mt-4 text-sm text-[var(--color-ink-muted)] sm:text-base">
        {t('suggestion')}
      </p>
    </header>
  )
}

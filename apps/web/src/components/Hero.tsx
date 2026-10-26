import { useTranslation } from 'react-i18next'
import type { Card } from '../lib/card-ui'
import { Search } from './Search'

interface HeroProps {
  onCardSelect: (card: Card) => void
}

export const Hero = ({ onCardSelect }: HeroProps) => {
  const { t } = useTranslation()

  return (
    <div className="text-center w-[70vw] mx-auto z-10">
      <h1
        className="sm:text-5xl text-3xl md:text-7xl lg:text-8xl font-bold mb-1 sm:mb-3 bg-linear-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent leading-tight"
        dangerouslySetInnerHTML={{ __html: t('title') }}
      />

      <p
        className="hidden sm:block sm:text-lg md:text-xl lg:text-2xl text-gray-700 mb-1 sm:mb-3"
        dangerouslySetInnerHTML={{ __html: t('subtitle') }}
      />

      <div className="w-full md:w-4/5 mx-auto">
        <Search onSelect={onCardSelect} />
      </div>

      <p className="sm:mt-6 mt-1 sm:text-base text-xs md:text-lg text-gray-600">
        {t('suggestion')}
      </p>
    </div>
  )
}

import { cards } from '@ambik/catalog'
import { useState, type JSX } from 'react'
import { useTranslation } from 'react-i18next'
import type { Card } from '../lib/card-ui'

interface SearchProps {
  onSelect?: (card: Card) => void
}

export function Search({ onSelect }: SearchProps): JSX.Element {
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  const { t } = useTranslation()

  const filteredCards = cards.filter(
    (card) =>
      card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.value.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const highlightText = (text: string) => {
    if (!searchTerm) return text
    const regex = new RegExp(`(${searchTerm})`, 'gi')
    const parts = text.split(regex)

    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="bg-purple-200">
          {part}
        </span>
      ) : (
        part
      ),
    )
  }

  return (
    <div className="relative max-w-md mx-auto">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => setIsSearchFocused(true)}
        onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
        placeholder={t('search_placeholder')}
        className="w-full px-6 py-3 rounded-full text-lg bg-white/80 backdrop-blur-xs border border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-hidden shadow-lg transition-all"
      />

      {isSearchFocused && searchTerm && (
        <div className="absolute mt-2 w-full bg-white rounded-lg shadow-xl border border-purple-100 max-h-60 overflow-auto z-50">
          {filteredCards.length > 0 ? (
            filteredCards.map((card) => (
              <div
                key={card.title}
                className="px-4 py-2 hover:bg-purple-50 cursor-pointer"
                onClick={() => {
                  setSearchTerm(card.title)
                  onSelect?.(card)
                }}
              >
                <div className="font-medium">{highlightText(card.title)}</div>
                <div className="text-sm text-gray-600">
                  {highlightText(card.value)}
                </div>
              </div>
            ))
          ) : (
            <div className="px-4 py-2 text-gray-500">No results found</div>
          )}
        </div>
      )}
    </div>
  )
}

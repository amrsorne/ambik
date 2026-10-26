import { cards } from '@ambik/catalog'
import { useState } from 'react'
import type { Card } from '../lib/card-ui'
import { useModal } from '../hooks/useModal'
import Attributions from './Attributions'
import FloatingCard from './FloatingCard'
import { Hero } from './Hero'
import Modal from './Modal'
import Navbar from './Navbar'

const Layout = () => {
  const [selectedCardTitle, setSelectedCardTitle] = useState<string | null>(null)
  const { isOpen, modalData, openModal, closeModal } = useModal()

  const getOrderedCards = () => {
    if (!selectedCardTitle) return cards
    const selectedCard = cards.find((card) => card.title === selectedCardTitle)
    const otherCards = cards.filter((card) => card.title !== selectedCardTitle)
    return selectedCard ? [selectedCard, ...otherCards] : cards
  }

  const selectedCard = cards.find((card) => card.title === modalData?.title)

  return (
    <div className="min-h-screen bg-linear-to-br from-[var(--color-surface)] via-indigo-50 to-violet-100">
      <main className="relative mx-auto min-h-screen max-w-7xl px-4 pb-24 pt-6 sm:px-6 lg:px-8 lg:pb-16 lg:pt-28">
        <Hero onCardSelect={(card: Card) => setSelectedCardTitle(card.title)} />

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:mt-10 lg:grid-cols-3 xl:grid-cols-4">
          {getOrderedCards().map((card, index) => (
            <FloatingCard
              key={card.title}
              {...card}
              index={index}
              title={`Idea ${index + 1}: ${card.title}`}
              onClick={() =>
                openModal(
                  card.title,
                  card.value,
                  card.description,
                  card.link,
                  card.img,
                )
              }
            />
          ))}
        </div>
      </main>

      <Navbar />
      <Attributions />
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        card={selectedCard || cards[0]}
      />
    </div>
  )
}

export default Layout

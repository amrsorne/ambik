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
    <div className="min-h-screen bg-linear-to-br from-purple-200 to-violet-150 via-pink-100">
      <main className="relative pt-2 lg:pt-32 pb-16 px-4 sm:px-6 lg:px-8 min-h-screen">
        <Hero onCardSelect={(card: Card) => setSelectedCardTitle(card.title)} />

        <div className="md:mt-12 mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {getOrderedCards().map((card, index) => (
            <FloatingCard
              key={card.title}
              {...card}
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

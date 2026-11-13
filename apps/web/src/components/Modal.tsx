import React, { useEffect, useState } from 'react'
import 'react-toastify/dist/ReactToastify.css'
import type { Card } from '../lib/card-ui'
import { DEFAULT_CARD_IMAGE } from '../constants/images'
import { useResolvedCardImage } from '../hooks/useResolvedCardImage'
import Waitlist from './Waitlist'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  card: Card
}

const baseClasses = 'bg-white/80 backdrop-blur-lg rounded-lg p-4 shadow-lg'

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, card }) => {
  const fallbackImage = useResolvedCardImage(card.img)
  const [selectedImage, setSelectedImage] = useState(fallbackImage)
  const [src, setSrc] = useState('')

  useEffect(() => {
    setSrc(new URLSearchParams(window.location.search).get('src') || '')
  }, [])

  const handleImageSelect = (image: string) => {
    setSelectedImage(image)
  }

  useEffect(() => {
    if (isOpen) {
      setSelectedImage(fallbackImage)
    }
  }, [card.img, fallbackImage, isOpen])

  if (!isOpen) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 transition-opacity duration-300"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
    >
      <div
        className={`${baseClasses} relative max-h-[90dvh] w-full max-w-md overflow-y-auto transition-transform duration-300`}
      >
        <div className="flex flex-col h-full">
          <div className="flex-1">
            <div className="flex justify-between">
              <h2 id="project-modal-title" className="pt-2 text-xl font-bold">
                {card.title}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="h-9 rounded-lg bg-red-500 px-3 text-sm font-medium text-white transition-colors hover:bg-red-600"
              >
                Close
              </button>
            </div>
            <p className="text-xs">Status: {card.value}</p>
            <p className="text-sm my-1">{card.description}</p>

            <div className="flex flex-col mb-2">
              <div className="aspect-video w-full overflow-hidden rounded-lg bg-slate-100">
                <img
                  src={selectedImage}
                  alt={`${card.title} preview`}
                  className="h-full w-full object-cover"
                  onError={(event) => {
                    event.currentTarget.onerror = null
                    event.currentTarget.src = DEFAULT_CARD_IMAGE
                  }}
                />
              </div>
              {card.img.length > 0 && (
                <div className="mt-4 grid grid-cols-4 gap-2">
                  {card.img.map((image, index) => (
                    <button
                      type="button"
                      key={index}
                      className="rounded border-0 p-0"
                      onClick={() => handleImageSelect(image)}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="h-12 w-12 object-cover"
                        onError={(event) => {
                          event.currentTarget.onerror = null
                          event.currentTarget.src = DEFAULT_CARD_IMAGE
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Waitlist url={card.link} src={src} service={card.service} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Modal

import React, { useEffect, useState } from 'react'
import 'react-toastify/dist/ReactToastify.css'
import type { Card } from '../lib/card-ui'
import Waitlist from './Waitlist'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  card: Card
}

const baseClasses = 'bg-white/80 backdrop-blur-lg rounded-lg p-4 shadow-lg'

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, card }) => {
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined,
  )
  const [src, setSrc] = useState('')

  useEffect(() => {
    setSrc(new URLSearchParams(window.location.search).get('src') || '')
  }, [])

  const handleImageSelect = (image: string) => {
    setSelectedImage(image)
  }

  useEffect(() => {
    setSelectedImage(card.img[0])
  }, [card.img, isOpen])

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black/50 transition-opacity
     duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
    >
      <div
        className={`${baseClasses} m-5 md:w-[400px] overflow-hidden
          transition-transform duration-300 transform ${isOpen ? 'scale-100' : 'scale-95'} relative`}
      >
        <div className="flex flex-col h-full">
          <div className="flex-1">
            <div className="flex justify-between">
              <h2 className="text-xl font-bold pt-5">{card.title}</h2>
              <button
                onClick={onClose}
                className="text-xs text-gray-100 bg-red-400 px-2 rounded-lg h-8"
              >
                Close [x]
              </button>
            </div>
            <p className="text-xs">Status: {card.value}</p>
            <p className="text-sm my-1">{card.description}</p>

            <div className="flex flex-col mb-2">
              <div className="w-full max-h-60">
                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : card.img.length > 0 ? (
                  <img
                    src={card.img[0]}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="my-30 w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                    <p>No Image Available</p>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-4 gap-2 mt-4">
                {card.img.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-12 h-12 object-cover"
                    onClick={() => handleImageSelect(image)}
                  />
                ))}
              </div>
            </div>

            <Waitlist url={card.link} src={src} service={card.service} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Modal

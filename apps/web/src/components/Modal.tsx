import React, { useEffect, useId, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import 'react-toastify/dist/ReactToastify.css'
import { X } from 'lucide-react'
import { isLiveCard, type Card } from '../lib/card-ui'
import { DEFAULT_CARD_IMAGE } from '../constants/images'
import { useResolvedCardImage } from '../hooks/useResolvedCardImage'
import Waitlist from './Waitlist'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  card: Card
}

const panelClasses =
  'relative flex max-h-[min(90dvh,40rem)] w-full max-w-md flex-col overflow-hidden rounded-xl border border-[var(--color-border-soft)] bg-[var(--color-surface)]/95 shadow-xl backdrop-blur-lg'

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, card }) => {
  const { t } = useTranslation()
  const fallbackImage = useResolvedCardImage(card.img)
  const [selectedImage, setSelectedImage] = React.useState(fallbackImage)
  const [src, setSrc] = React.useState('')
  const closeRef = useRef<HTMLButtonElement>(null)
  const descriptionId = useId()

  useEffect(() => {
    setSrc(new URLSearchParams(window.location.search).get('src') || '')
  }, [])

  useEffect(() => {
    if (isOpen) {
      setSelectedImage(fallbackImage)
    }
  }, [card.img, fallbackImage, isOpen])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const previousFocus = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const frame = requestAnimationFrame(() => {
      closeRef.current?.focus()
    })

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
      previousFocus?.focus()
    }
  }, [isOpen, onClose])

  if (!isOpen) {
    return null
  }

  const statusText = `${t('modal.status_label')}: ${card.value}`

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 motion-safe:transition-opacity motion-safe:duration-200"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        aria-describedby={descriptionId}
        className={panelClasses}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-[var(--color-border-soft)] px-4 pb-3 pt-4">
          <div className="min-w-0 flex-1">
            <h2
              id="project-modal-title"
              className="text-balance text-xl font-bold tracking-tight text-[var(--color-ink)]"
            >
              {card.title}
            </h2>
            <p className="mt-1 text-xs font-medium text-[var(--color-ink-muted)]">
              {statusText}
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[var(--color-border-soft)] bg-white/80 text-[var(--color-ink)] transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand)]"
          >
            <X className="h-5 w-5" aria-hidden />
            <span className="sr-only">{t('modal.close')}</span>
          </button>
        </div>

        <div
          id={descriptionId}
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-3"
        >
          <p className="text-sm leading-relaxed text-[var(--color-ink)]">
            {card.description}
          </p>

          <div className="mt-3 flex flex-col">
            <div className="aspect-video w-full overflow-hidden rounded-lg bg-slate-100">
              <img
                src={selectedImage}
                alt={t('modal.preview_alt', { title: card.title })}
                className="h-full w-full object-cover"
                onError={(event) => {
                  event.currentTarget.onerror = null
                  event.currentTarget.src = DEFAULT_CARD_IMAGE
                }}
              />
            </div>
            {card.img.length > 0 && (
              <div
                className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5"
                role="group"
                aria-label={t('modal.gallery_label')}
              >
                {card.img.map((image, index) => {
                  const isSelected = selectedImage === image
                  return (
                    <button
                      type="button"
                      key={image}
                      aria-current={isSelected ? 'true' : undefined}
                      aria-label={t('modal.select_image', { index: index + 1 })}
                      className={`min-h-11 rounded-lg border-2 p-0 transition-[border-color,box-shadow] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand)] ${
                        isSelected
                          ? 'border-[var(--color-brand)] shadow-sm'
                          : 'border-transparent'
                      }`}
                      onClick={() => setSelectedImage(image)}
                    >
                      <img
                        src={image}
                        alt=""
                        className="h-12 w-full rounded-md object-cover"
                        onError={(event) => {
                          event.currentTarget.onerror = null
                          event.currentTarget.src = DEFAULT_CARD_IMAGE
                        }}
                      />
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        <Waitlist
          url={card.link}
          src={src}
          service={card.service}
          canOpenProject={isLiveCard(card.value)}
        />
      </div>
    </div>
  )
}

export default Modal

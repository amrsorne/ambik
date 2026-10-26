import { useState } from 'react'

interface ModalData {
  title: string
  value: string
  description: string | undefined
  link: string
  img: string[]
}

export const useModal = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [modalData, setModalData] = useState<ModalData>({
    title: '',
    value: '',
    description: '',
    link: '',
    img: [],
  })

  const openModal = (
    title: string,
    value: string,
    description: string | undefined,
    link: string,
    img: string[],
  ) => {
    setModalData({ title, value, description, link, img })
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
  }

  return {
    isOpen,
    modalData,
    openModal,
    closeModal,
  }
}

import type React from 'react'
import { iconMap, type FloatingCardProps } from '../lib/card-ui'

const FloatingCard: React.FC<FloatingCardProps> = ({
  title,
  value,
  icon,
  className = '',
  description,
  link,
  img,
  onClick,
  status = 'Inactive',
}) => {
  const Icon = iconMap[icon]

  const baseClasses = 'w-full backdrop-blur-lg rounded-lg p-4 shadow-lg'

  const randomFloat = () => {
    const tx = `${Math.floor(Math.random() * 13 - 7)}px`
    const ty = `${Math.floor(Math.random() * 12 - 8)}px`
    const rot = `${(Math.random() * 1.5 - 1).toFixed(1)}deg`

    return {
      '--tx': tx,
      '--ty': ty,
      '--rot': rot,
    } as React.CSSProperties
  }

  const bgImage = img[0]
    ? `linear-gradient(to right, rgba(255, 255, 255, 0.9) 20%, rgba(255, 255, 255, 0.2) 90%, transparent), url(${img[0]}) no-repeat center / cover`
    : 'linear-gradient(to right, rgba(255, 255, 255, 0.9) 20%, rgba(255, 255, 255, 0.95) 90%)'

  return (
    <div
      className={`${baseClasses} ${className} animate-float cards cursor-pointer`}
      style={{
        ...randomFloat(),
        background: bgImage,
      }}
      onClick={() => onClick(title, value, description, link, img)}
    >
      <div className="flex items-center justify-between mb-2">
        <h3
          className={`text-sm  ${status === 'Active' ? 'text-blue-500' : ''}`}
        >
          {value}
        </h3>
        <Icon className="w-4 h-4 text-purple-500" />
      </div>
      <p
        className={`text-xl
        ${status === 'Active' ? 'font-semibold bg-gradient-to-r from-purple-800 to-purple-400/50 text-transparent bg-clip-text' : ''}`}
      >
        {title}
      </p>
    </div>
  )
}

export default FloatingCard

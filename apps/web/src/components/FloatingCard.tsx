import type React from 'react'
import { iconMap, type FloatingCardProps } from '../lib/card-ui'

const floatOffset = (index: number) => {
  const n = index + 1
  return {
    '--tx': `${(n % 5) - 2}px`,
    '--ty': `${((n * 3) % 7) - 3}px`,
    '--rot': `${(((n * 7) % 11) - 5) / 10}deg`,
  } as React.CSSProperties
}

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
  index = 0,
}) => {
  const Icon = iconMap[icon]
  const isActive = status === 'Active'
  const preview = img[0]

  return (
    <button
      type="button"
      className={`group relative flex min-h-[6.25rem] w-full cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-[var(--color-border-soft)] bg-[var(--color-surface-elevated)]/90 p-4 text-left shadow-sm transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand)] motion-safe:animate-float ${className}`}
      style={floatOffset(index)}
      onClick={() => onClick(title, value, description, link, img)}
    >
      {preview ? (
        <img
          src={preview}
          alt=""
          loading="lazy"
          decoding="async"
          className="pointer-events-none absolute -bottom-3 -right-3 h-24 w-24 rounded-xl object-cover opacity-35 ring-1 ring-white/80 transition-opacity duration-200 group-hover:opacity-50 sm:h-28 sm:w-28"
        />
      ) : (
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-linear-to-br from-indigo-100 to-violet-200 opacity-80"
        />
      )}

      <div className="relative z-10 flex items-start justify-between gap-2 pr-16">
        <p
          className={`line-clamp-2 text-xs font-medium ${isActive ? 'text-[var(--color-brand-strong)]' : 'text-[var(--color-ink-muted)]'}`}
        >
          {value}
        </p>
        <Icon
          className="h-4 w-4 shrink-0 text-[var(--color-brand)]"
          aria-hidden
        />
      </div>

      <p
        className={`relative z-10 mt-2 line-clamp-2 text-base font-semibold leading-snug sm:text-lg ${
          isActive ? 'text-[var(--color-brand-strong)]' : 'text-[var(--color-ink)]'
        }`}
      >
        {title}
      </p>
    </button>
  )
}

export default FloatingCard

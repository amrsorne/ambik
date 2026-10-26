import type { Card, IconName } from '@ambik/catalog'
import {
  Brain,
  Percent,
  Star,
  Target,
  TrendingUp,
  Users,
  Zap,
  type LucideIcon,
} from 'lucide-react'

export type { Card, IconName }

export const iconMap: Record<IconName, LucideIcon> = {
  target: Target,
  users: Users,
  zap: Zap,
  'trending-up': TrendingUp,
  percent: Percent,
  star: Star,
  brain: Brain,
}

export interface FloatingCardProps {
  title: string
  value: string
  description?: string
  className?: string
  index?: number
  status?: 'Active' | 'Inactive'
  icon: IconName
  link: string
  onClick: (
    title: string,
    value: string,
    description?: string,
    link?: string,
    img?: string[],
  ) => void
  img: string[]
}

export type IconName =
  | 'target'
  | 'users'
  | 'zap'
  | 'trending-up'
  | 'percent'
  | 'star'
  | 'brain'

export interface LinkEntry {
  service: string
  url: string
}

export interface Card {
  title: string
  value: string
  description?: string
  icon: IconName
  link: string
  img: string[]
  service: string
  status: 'Active' | 'Inactive'
}

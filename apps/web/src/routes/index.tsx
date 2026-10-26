import { createFileRoute } from '@tanstack/react-router'
import Layout from '../components/Layout'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return <Layout />
}

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Suspense } from 'react'
import { Router } from 'react-chrome-extension-router'
import { LoadingSpinner } from './components/LoadingSpinner'
import { EmptyState } from './pages/EmptyState'
import { SiteList } from './pages/SiteList'
import { useSites } from './utils/useSites'

const queryClient = new QueryClient()

function AppContent() {
  const { data: sites } = useSites()
  const InitialComponent = sites.length === 0 ? EmptyState : SiteList

  return (
    <Router>
      <InitialComponent />
    </Router>
  )
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<LoadingSpinner />}>
        <AppContent />
      </Suspense>
    </QueryClientProvider>
  )
}

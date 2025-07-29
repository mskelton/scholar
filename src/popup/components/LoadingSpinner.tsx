import { Loader2Icon } from 'lucide-react'

export function LoadingSpinner() {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="flex items-center space-x-2">
        <Loader2Icon className="size-12 animate-spin" />
        <span className="sr-only">Loading</span>
      </div>
    </div>
  )
}

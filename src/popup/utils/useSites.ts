import { StorageData } from '@/types'
import { useSuspenseQuery } from '@tanstack/react-query'

export function useSites() {
  return useSuspenseQuery({
    queryKey: ['sites'],
    queryFn: async () => {
      const result = await chrome.storage.local.get<StorageData>(['sites'])
      return result.sites || []
    },
  })
}

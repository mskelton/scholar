import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Site } from '@/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2Icon, XIcon } from 'lucide-react'
import { useState } from 'react'
import { goBack } from 'react-chrome-extension-router'
import { sendMessage } from '../sendMessage'

export function AddSite() {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({ name: '', url: '' })

  const { mutateAsync: addSite, isPending: isSubmitting } = useMutation({
    mutationFn: async (site: Pick<Site, 'name' | 'url'>) => {
      if (!site.name.trim() || !site.url.trim()) {
        return
      }

      const siteData = {
        name: site.name.trim(),
        url: site.url.trim(),
        currentPage: site.url.trim(),
        lastVisited: Date.now(),
      }

      return sendMessage('ADD_SITE', siteData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sites'] })
      goBack()
    },
  })

  const handleSubmit = () => {
    addSite(formData)
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Add Site</h1>

        <Button
          variant="ghost"
          size="icon"
          onClick={goBack}
          disabled={isSubmitting}
          className="size-8"
        >
          <XIcon />
        </Button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Site Name
          </label>
          <Input
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            disabled={isSubmitting}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="url" className="text-sm font-medium">
            URL
          </label>
          <Input
            value={formData.url}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, url: e.target.value }))
            }
            disabled={isSubmitting}
          />
        </div>

        <Button
          onClick={handleSubmit}
          disabled={
            isSubmitting || !formData.name.trim() || !formData.url.trim()
          }
          className="w-full"
        >
          {isSubmitting && (
            <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
          )}
          Add Site
        </Button>
      </div>
    </div>
  )
}

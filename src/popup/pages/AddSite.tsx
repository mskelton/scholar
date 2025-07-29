import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ArrowLeftIcon, Loader2Icon } from 'lucide-react'
import { goBack } from 'react-chrome-extension-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { sendMessage } from '../sendMessage'
import { Site } from '@/types'

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
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={goBack}
          disabled={isSubmitting}
        >
          <ArrowLeftIcon className="w-4 h-4" />
        </Button>
        <h1 className="text-xl font-semibold">Add New Site</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Site Information</CardTitle>
          <CardDescription>
            Enter the details of the documentation website you want to track
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Site Name
            </label>
            <Input
              id="name"
              placeholder="e.g., Playwright Docs"
              value={formData.name}
              onChange={e =>
                setFormData(prev => ({ ...prev, name: e.target.value }))
              }
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="url" className="text-sm font-medium">
              URL
            </label>
            <Input
              id="url"
              placeholder="https://playwright.dev/"
              value={formData.url}
              onChange={e =>
                setFormData(prev => ({ ...prev, url: e.target.value }))
              }
              disabled={isSubmitting}
            />
          </div>
        </CardContent>
        <CardFooter>
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
        </CardFooter>
      </Card>
    </div>
  )
}

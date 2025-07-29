import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { formatDate } from '@/lib/utils'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { PlusIcon, XIcon } from 'lucide-react'
import { Link } from 'react-chrome-extension-router'
import { sendMessage } from '../sendMessage'
import { useSites } from '../utils/useSites'
import { AddSite } from './AddSite'

export function SiteList() {
  const queryClient = useQueryClient()
  const { data: sites } = useSites()

  const { mutateAsync: removeSite } = useMutation({
    mutationFn: async (siteId: string) => {
      await sendMessage('REMOVE_SITE', { siteId })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sites'] })
    },
  })

  const openSite = async (site: any) => {
    await sendMessage('OPEN_SITE', { siteId: site.id })
    queryClient.invalidateQueries({ queryKey: ['sites'] })
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Scholar</h1>
        <Button asChild size="sm">
          <Link component={AddSite}>Add Site</Link>
        </Button>
      </div>

      <div className="space-y-3">
        {sites.map((site) => (
          <Card key={site.id}>
            <CardHeader>
              <CardTitle>{site.name}</CardTitle>
              <CardDescription className="text-xs truncate">
                {site.currentPage}
              </CardDescription>

              <CardAction>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeSite(site.id)}
                  className="size-8"
                >
                  <XIcon />
                  <span className="sr-only">Remove site</span>
                </Button>
              </CardAction>
            </CardHeader>

            <CardFooter>
              <Button
                className="w-full"
                size="sm"
                onClick={() => openSite(site)}
                variant="secondary"
              >
                Continue Learning
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

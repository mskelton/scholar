import { Button } from '@/components/ui/button'
import {
  Card,
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
        <h1 className="text-xl font-semibold">Your Learning Sites</h1>
        <Link component={AddSite}>
          <Button size="sm">
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Site
          </Button>
        </Link>
      </div>

      <div className="space-y-3">
        {sites.map(site => (
          <Card key={site.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-base">{site.name}</CardTitle>
                  <CardDescription className="text-xs break-all">
                    {site.currentPage}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSite(site.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <XIcon className="w-4 h-4" />
                  <span className="sr-only">Remove site</span>
                </Button>
              </div>
            </CardHeader>
            <CardFooter className="pt-0">
              <div className="flex justify-between items-center w-full">
                <span className="text-xs text-muted-foreground">
                  Last visited: {formatDate(site.lastVisited)}
                </span>
                <Button size="sm" onClick={() => openSite(site)}>
                  Continue Learning
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

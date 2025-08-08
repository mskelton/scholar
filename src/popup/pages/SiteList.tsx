import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { XIcon } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-chrome-extension-router'
import { sendMessage } from '../utils/sendMessage'
import { useSites } from '../utils/useSites'
import { AddSite } from './AddSite'

export function SiteList() {
  const queryClient = useQueryClient()
  const { data: sites } = useSites()
  const [siteToRemove, setSiteToRemove] = useState<any>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const { mutateAsync: removeSite } = useMutation({
    mutationFn: async (siteId: string) => {
      await sendMessage('REMOVE_SITE', { siteId })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sites'] })
      setIsDrawerOpen(false)
      setSiteToRemove(null)
    },
  })

  const openSite = async (site: any) => {
    await sendMessage('OPEN_SITE', { siteId: site.id })
    queryClient.invalidateQueries({ queryKey: ['sites'] })
  }

  const handleRemoveClick = (site: any) => {
    setSiteToRemove(site)
    setIsDrawerOpen(true)
  }

  const handleConfirmRemove = () => {
    if (siteToRemove) {
      removeSite(siteToRemove.id)
    }
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
                  onClick={() => handleRemoveClick(site)}
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

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Are you absolutely sure?</DrawerTitle>
            <DrawerDescription>
              This will permanently remove "{siteToRemove?.name}" and cannot be
              undone.
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <Button onClick={handleConfirmRemove} variant="destructive">
              Remove Site
            </Button>
            <DrawerClose>
              <Button className="w-full" variant="outline">
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  )
}

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { formatDate } from '@/lib/utils'
import { Site } from '@/types'
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { ArrowLeftIcon, Loader2Icon, PlusIcon, XIcon } from 'lucide-react'
import { Suspense, useState } from 'react'
import { sendMessage } from './sendMessage'

type Page = 'empty' | 'add' | 'list'

function LoadingSpinner() {
  return (
    <div className="p-4 flex items-center justify-center">
      <div className="flex items-center space-x-2">
        <Loader2Icon className="w-4 h-4 animate-spin" />
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    </div>
  )
}

function AppContent() {
  const queryClient = useQueryClient()
  const { data: sites } = useSuspenseQuery({
    queryKey: ['sites'],
    queryFn: () => sendMessage('GET_SITES'),
  })

  const { mutateAsync: addSite, isPending: isSubmitting } = useMutation({
    mutationFn: async (site: Pick<Site, 'name' | 'url'>) => {
      if (!site.name.trim() || !site.url.trim()) {
        return
      }

      const siteData = {
        name: formData.name.trim(),
        url: formData.url.trim(),
        currentPage: formData.url.trim(),
        lastVisited: Date.now(),
      }

      setFormData({ name: '', url: '' })
      setCurrentPage('list')

      return sendMessage('ADD_SITE', siteData)
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['sites'] })
      // queryClient.setQueryData(['sites'], data)
    },
  })

  const [currentPage, setCurrentPage] = useState<Page>(
    sites.length === 0 ? 'empty' : 'list'
  )
  const [formData, setFormData] = useState({ name: '', url: '' })

  const { mutateAsync: removeSite } = useMutation({
    mutationFn: async (siteId: string) => {
      await sendMessage('REMOVE_SITE', { siteId })
      queryClient.invalidateQueries({ queryKey: ['sites'] })
      queryClient.setQueryData(['sites'], (data: Site[]) =>
        data.filter(site => site.id !== siteId)
      )
    },
  })

  const openSite = async (site: Site) => {
    await sendMessage('OPEN_SITE', { siteId: site.id })
    queryClient.invalidateQueries({ queryKey: ['sites'] })
  }

  const renderEmptyState = () => (
    <div className="p-4 space-y-6">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
          <PlusIcon className="w-8 h-8 text-muted-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold mb-2">
            Welcome to Learning Tracker
          </h1>
          <p className="text-sm text-muted-foreground">
            Start tracking your progress on documentation websites
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              No sites added yet. Add your first documentation site to get
              started!
            </p>
            <Button
              onClick={() => setCurrentPage('add')}
              className="w-full"
              size="lg"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Your First Site
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderAddForm = () => (
    <div className="p-4 space-y-4">
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentPage(sites.length === 0 ? 'empty' : 'list')}
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
              name="name"
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
              name="url"
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
            onClick={() => addSite(formData)}
            disabled={
              isSubmitting || !formData.name.trim() || !formData.url.trim()
            }
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
                Adding...
              </>
            ) : (
              'Add Site'
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )

  const renderSiteList = () => (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Your Learning Sites</h1>
        <Button size="sm" onClick={() => setCurrentPage('add')}>
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Site
        </Button>
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

  switch (currentPage) {
    case 'empty':
      return renderEmptyState()
    case 'add':
      return renderAddForm()
    case 'list':
      return renderSiteList()
    default:
      return renderEmptyState()
  }
}

export function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AppContent />
    </Suspense>
  )
}

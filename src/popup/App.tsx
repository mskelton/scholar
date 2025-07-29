import React, { useState, useEffect } from 'react'
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
import { Site } from '@/types'
import { getDomainFromUrl, formatDate } from '@/lib/utils'
import { XIcon } from 'lucide-react'
import { sendMessage } from './sendMessage'

export function App() {
  const [sites, setSites] = useState<Site[]>([])
  const [newUrl, setNewUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadSites()
  }, [])

  const loadSites = async () => {
    const response = await sendMessage('GET_SITES')
    setSites(response || [])
  }

  const addSite = async () => {
    if (!newUrl.trim()) {
      return
    }

    setIsLoading(true)
    const url = newUrl.trim()
    const domain = getDomainFromUrl(url)

    const siteData = {
      name: domain,
      url,
      currentPage: url,
      lastVisited: Date.now(),
    }

    const response = await sendMessage('ADD_SITE', siteData)

    setSites(prevSites => [...prevSites, response])
    setNewUrl('')
    setIsLoading(false)
  }

  const removeSite = async (siteId: string) => {
    await sendMessage('REMOVE_SITE', { siteId })
    setSites(prevSites => prevSites.filter(site => site.id !== siteId))
  }

  const openSite = async (site: Site) => {
    await sendMessage('OPEN_SITE', { siteId: site.id })

    setSites(prevSites =>
      prevSites.map(s =>
        s.id === site.id ? { ...s, lastVisited: Date.now() } : s
      )
    )
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addSite()
    }
  }

  return (
    <div className="p-4 space-y-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Learning Tracker</h1>
        <p className="text-sm text-muted-foreground">
          Track your progress on documentation websites
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Add New Site</CardTitle>
          <CardDescription>
            Enter the URL of a documentation website you want to track
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              placeholder="https://playwright.dev/"
              value={newUrl}
              onChange={e => setNewUrl(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
            <Button onClick={addSite} disabled={isLoading || !newUrl.trim()}>
              {isLoading ? 'Adding...' : 'Add'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Your Learning Sites</h2>
        {sites.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                No sites added yet. Add your first documentation site above!
              </p>
            </CardContent>
          </Card>
        ) : (
          sites.map(site => (
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
          ))
        )}
      </div>
    </div>
  )
}

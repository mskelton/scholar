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
import { LearningSite } from '@/types'
import { generateId, getDomainFromUrl, formatDate } from '@/lib/utils'

function App() {
  const [sites, setSites] = useState<LearningSite[]>([])
  const [newUrl, setNewUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadSites()
  }, [])

  const loadSites = async () => {
    try {
      const result = await chrome.storage.local.get(['sites'])
      setSites(result.sites || [])
    } catch (error) {
      console.error('Error loading sites:', error)
    }
  }

  const saveSites = async (updatedSites: LearningSite[]) => {
    try {
      await chrome.storage.local.set({ sites: updatedSites })
      setSites(updatedSites)
    } catch (error) {
      console.error('Error saving sites:', error)
    }
  }

  const addSite = async () => {
    if (!newUrl.trim()) return

    setIsLoading(true)
    try {
      const url = newUrl.trim()
      const domain = getDomainFromUrl(url)

      const newSite: LearningSite = {
        id: generateId(),
        name: domain,
        url,
        currentPage: url,
        lastVisited: Date.now(),
        createdAt: Date.now(),
      }

      const updatedSites = [...sites, newSite]
      await saveSites(updatedSites)
      setNewUrl('')
    } catch (error) {
      console.error('Error adding site:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const removeSite = async (siteId: string) => {
    const updatedSites = sites.filter(site => site.id !== siteId)
    await saveSites(updatedSites)
  }

  const openSite = async (site: LearningSite) => {
    try {
      // Create a new tab and track it
      const tab = await chrome.tabs.create({ url: site.currentPage })

      // Store the tab info for tracking
      const tabInfo = {
        tabId: tab.id!,
        siteId: site.id,
        url: site.currentPage,
      }

      const result = await chrome.storage.local.get(['trackedTabs'])
      const trackedTabs = result.trackedTabs || []
      trackedTabs.push(tabInfo)

      await chrome.storage.local.set({ trackedTabs })

      // Update the site's last visited time
      const updatedSites = sites.map(s =>
        s.id === site.id ? { ...s, lastVisited: Date.now() } : s
      )
      await saveSites(updatedSites)
    } catch (error) {
      console.error('Error opening site:', error)
    }
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

      {/* Add new site */}
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

      {/* Sites list */}
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
                    ×
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

export default App

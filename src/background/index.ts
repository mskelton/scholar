import { Site, TabInfo, StorageData } from '@/types'
import { Message } from '@/lib/message'

chrome.runtime.onMessage.addListener((message: Message, _, sendResponse) => {
  handleMessage(message, sendResponse)
  return true
})

async function handleMessage(
  message: Message,
  sendResponse: (response: any) => void
) {
  switch (message.type) {
    case 'GET_SITES':
      const sites = await getSites()
      sendResponse(sites)
      break

    case 'ADD_SITE':
      const newSite = await addSite(message.request)
      sendResponse(newSite)
      break

    case 'REMOVE_SITE':
      await removeSite(message.request.siteId)
      sendResponse(undefined)
      break

    case 'OPEN_SITE':
      const tabInfo = await openSite(message.request.siteId)
      sendResponse(tabInfo)
      break
  }
}

// Storage operations
async function getSites(): Promise<Site[]> {
  const result = await chrome.storage.local.get<StorageData>(['sites'])
  return result.sites || []
}

async function addSite(
  siteData: Omit<Site, 'id' | 'createdAt'>
): Promise<Site> {
  const sites = await getSites()
  const newSite: Site = {
    ...siteData,
    id: generateId(),
    createdAt: Date.now(),
  }

  const updatedSites = [...sites, newSite]
  await chrome.storage.local.set({ sites: updatedSites })

  return newSite
}

async function removeSite(siteId: string): Promise<void> {
  const sites = await getSites()
  const updatedSites = sites.filter(site => site.id !== siteId)
  await chrome.storage.local.set({ sites: updatedSites })
}

async function updateSiteLastVisited(siteId: string): Promise<void> {
  const sites = await getSites()
  const updatedSites = sites.map(site =>
    site.id === siteId ? { ...site, lastVisited: Date.now() } : site
  )
  await chrome.storage.local.set({ sites: updatedSites })
}

async function openSite(siteId: string): Promise<TabInfo> {
  const sites = await getSites()
  const site = sites.find(s => s.id === siteId)
  if (!site) {
    throw new Error(`Site ${siteId} not found`)
  }

  const tab = await chrome.tabs.create({ url: site.currentPage })

  const tabInfo: TabInfo = {
    tabId: tab.id!,
    siteId: site.id,
  }

  const result = await chrome.storage.local.get<StorageData>(['trackedTabs'])
  const trackedTabs = result.trackedTabs || []
  trackedTabs.push(tabInfo)

  await chrome.storage.local.set({ trackedTabs })

  // Update last visited
  await updateSiteLastVisited(site.id)

  return tabInfo
}

// Tab tracking operations
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    await updateSiteProgress(tabId, tab.url)
  }
})

chrome.tabs.onRemoved.addListener(async tabId => {
  await removeTrackedTab(tabId)
})

async function updateSiteProgress(tabId: number, newUrl: string) {
  const result = await chrome.storage.local.get<StorageData>([
    'trackedTabs',
    'sites',
  ])
  const trackedTabs = result.trackedTabs || []
  const sites = result.sites || []

  const trackedTab = trackedTabs.find(t => t.tabId === tabId)
  if (!trackedTab) return

  const site = sites.find(s => s.id === trackedTab.siteId)
  if (site) {
    site.currentPage = newUrl
    site.lastVisited = Date.now()
  }

  await chrome.storage.local.set({ sites })
  console.log(`Updated progress for site ${trackedTab.siteId} to ${newUrl}`)
}

async function removeTrackedTab(tabId: number) {
  const result = await chrome.storage.local.get<StorageData>(['trackedTabs'])
  const trackedTabs = result.trackedTabs || []

  const updatedTrackedTabs = trackedTabs.filter(t => t.tabId !== tabId)
  await chrome.storage.local.set({ trackedTabs: updatedTrackedTabs })

  console.log(`Removed tracked tab ${tabId}`)
}

// Utility function for generating IDs
function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

interface TabInfo {
  tabId: number
  siteId: string
}

interface Site {
  id: string
  currentPage: string
  lastVisited: number
}

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    await updateSiteProgress(tabId, tab.url)
  }
})

chrome.tabs.onRemoved.addListener(async tabId => {
  await removeTrackedTab(tabId)
})

async function updateSiteProgress(tabId: number, newUrl: string) {
  const result = await chrome.storage.local.get<{
    trackedTabs: TabInfo[]
    sites: Site[]
  }>(['trackedTabs', 'sites'])

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
  const result = await chrome.storage.local.get<{
    trackedTabs: TabInfo[]
  }>(['trackedTabs'])
  const trackedTabs = result.trackedTabs || []

  const updatedTrackedTabs = trackedTabs.filter(t => t.tabId !== tabId)

  await chrome.storage.local.set({ trackedTabs: updatedTrackedTabs })

  console.log(`Removed tracked tab ${tabId}`)
}

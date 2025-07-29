interface TabInfo {
  tabId: number
  siteId: string
  url: string
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

  // Find if this tab is being tracked
  const trackedTab = trackedTabs.find(t => t.tabId === tabId)
  if (!trackedTab) return

  // Update the tracked tab's URL
  trackedTab.url = newUrl

  // Update the corresponding site's current page
  const siteIndex = sites.findIndex(s => s.id === trackedTab.siteId)
  if (siteIndex !== -1) {
    sites[siteIndex].currentPage = newUrl
    sites[siteIndex].lastVisited = Date.now()
  }

  // Save the updated data
  await chrome.storage.local.set({
    trackedTabs,
    sites,
  })

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

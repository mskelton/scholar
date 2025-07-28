// Background script for tracking learning progress

interface TabInfo {
  tabId: number
  siteId: string
  url: string
}

// Listen for tab updates
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    await updateSiteProgress(tabId, tab.url)
  }
})

// Listen for tab removal
chrome.tabs.onRemoved.addListener(async tabId => {
  await removeTrackedTab(tabId)
})

async function updateSiteProgress(tabId: number, newUrl: string) {
  try {
    // Get tracked tabs
    const result = await chrome.storage.local.get(['trackedTabs', 'sites'])
    const trackedTabs: TabInfo[] = result.trackedTabs || []
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
  } catch (error) {
    console.error('Error updating site progress:', error)
  }
}

async function removeTrackedTab(tabId: number) {
  try {
    const result = await chrome.storage.local.get(['trackedTabs'])
    const trackedTabs: TabInfo[] = result.trackedTabs || []

    const updatedTrackedTabs = trackedTabs.filter(t => t.tabId !== tabId)

    await chrome.storage.local.set({ trackedTabs: updatedTrackedTabs })

    console.log(`Removed tracked tab ${tabId}`)
  } catch (error) {
    console.error('Error removing tracked tab:', error)
  }
}

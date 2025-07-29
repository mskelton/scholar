export interface Site {
  id: string
  name: string
  url: string
  currentPage: string
  lastVisited: number
  createdAt: number
}

export interface TabInfo {
  tabId: number
  siteId: string
}

export interface StorageData {
  sites: Site[]
  trackedTabs: TabInfo[]
}

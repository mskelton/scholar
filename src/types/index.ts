export interface LearningSite {
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
  url: string
}

export interface StorageData {
  sites: LearningSite[]
  trackedTabs: TabInfo[]
}

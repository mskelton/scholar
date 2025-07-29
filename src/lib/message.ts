import { Site } from '@/types'

export type Message =
  | {
      type: 'GET_SITES'
      request: void
      response: Site[]
    }
  | {
      type: 'ADD_SITE'
      request: Omit<Site, 'id' | 'createdAt'>
      response: Site
    }
  | {
      type: 'REMOVE_SITE'
      request: { siteId: string }
      response: void
    }
  | {
      type: 'OPEN_SITE'
      request: { siteId: string }
      response: void
    }

export type MessageResponse<T extends Message['type']> = Extract<
  Message,
  { type: T }
>['response']

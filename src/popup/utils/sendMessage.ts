import { Message, MessageResponse } from '@/lib/message'

export function sendMessage<T extends Message['type']>(
  type: T,
): Promise<MessageResponse<T>>
export function sendMessage<T extends Message['type']>(
  type: T,
  request: Extract<Message, { type: T }>['request'],
): Promise<MessageResponse<T>>
export function sendMessage<T extends Message['type']>(
  type: T,
  request?: Extract<Message, { type: T }>['request'],
): Promise<MessageResponse<T>> {
  return new Promise<MessageResponse<T>>((resolve) => {
    chrome.runtime.sendMessage({ type, request }, (response) => {
      resolve(response)
    })
  })
}

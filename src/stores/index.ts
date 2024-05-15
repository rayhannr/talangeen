import { createStore } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { Member } from './models'

export const store = createStore()

const storageConfig = {
  getItem(key: string, initialValue: any) {
    const storedValue = localStorage.getItem(key)
    try {
      return JSON.parse(storedValue ?? '')
    } catch {
      return initialValue
    }
  },
  setItem(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value))
  },
  removeItem(key: string) {
    localStorage.removeItem(key)
  },
  subscribe() {},
}

// @ts-ignore
export const membersAtom = atomWithStorage<Member[]>('talangeen-members', [], storageConfig, { getOnInit: true })

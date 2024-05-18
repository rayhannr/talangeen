import { atom, createStore } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { Member, Transaction } from './models'

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
// @ts-ignore
export const membersMapAtom = atom<Map<string, string>>((get) => {
  const members = get(membersAtom) as Member[]
  const membersMap = new Map<string, string>()

  members.forEach((member) => {
    membersMap.set(member.id, member.name)
  })

  return membersMap
})

// @ts-ignore
export const transactionsAtom = atomWithStorage<Transaction[]>('talangeen-transactions', [], storageConfig, { getOnInit: true })

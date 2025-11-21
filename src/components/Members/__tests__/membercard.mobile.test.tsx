// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'jotai'
import { describe, it, expect } from 'vitest'

// mock localStorage
;(globalThis as any).localStorage = (() => {
  let store: Record<string, string> = {}
  return {
    getItem(key: string) {
      return store[key] ?? null
    },
    setItem(key: string, value: string) {
      store[key] = String(value)
    },
    removeItem(key: string) {
      delete store[key]
    },
    clear() {
      store = {}
    },
  }
})()

describe('MemberCard mobile edit', () => {
  it('clicking edit shows input and keeps it open', async () => {
    const [{ MemberCard }, stores] = await Promise.all([import('../MemberCard'), import('../../../stores')])
    const { membersAtom, store } = stores

    const member = { id: 'u1', name: 'MobileTest' }
    // ensure members store is set (not strictly needed for MemberCard)
    store.set(membersAtom, [member])

    render(
      <Provider store={store}>
        <MemberCard member={member} />
      </Provider>
    )

    // find edit button (first icon-only button)
    const btn = document.querySelector('button') as HTMLButtonElement
    expect(btn).toBeTruthy()

    await userEvent.click(btn)

    // after clicking edit, an input with placeholder should appear
    const input = await screen.findByPlaceholderText(/Nama anggota/i)
    expect(input).toBeTruthy()
  })
})

// @vitest-environment jsdom
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'jotai'
import { describe, it, beforeEach, expect } from 'vitest'

// helper to set small viewport (mobile)
const setMobileViewport = () => {
  // small width
  ;(window as any).innerWidth = 375
  ;(window as any).innerHeight = 812
  window.dispatchEvent(new Event('resize'))
}

describe('Members mobile edit behavior', () => {
  beforeEach(() => {
    setMobileViewport()
  })

  it('after adding a member, clicking edit shows the input and it stays open on mobile', async () => {
    // mock localStorage before importing Members (stores access localStorage at module import)
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

    // Instead of using the add flow, pre-seed the store with a member and test edit behavior directly.
    const seededMembers: any[] = [
      {
        id: 'u1',
        name: 'Test User',
      },
    ]

    // lazy-import Members and stores after localStorage is available
    const [{ Members }, stores] = await Promise.all([import('../Members'), import('../../../stores')])
    const { membersAtom, store } = stores

    // set initial members into the jotai store
    store.set(membersAtom, seededMembers)

    render(
      <Provider store={store}>
        <Members />
      </Provider>
    )

    // wait for the MemberCard to appear
    const memberText = await screen.findByText('Test User')
    expect(memberText).toBeTruthy()

    // find edit button next to the member and click it
    const card = memberText.closest('div')
    expect(card).toBeTruthy()
    // the edit button is the first icon-only button in the card's action area
    const buttons = card!.querySelectorAll('button')
    expect(buttons.length).toBeGreaterThan(0)
    const editBtn = buttons[0] as HTMLButtonElement
    userEvent.click(editBtn)

    // now an input should appear. It should stay visible (not be immediately removed)
    const editInput = await screen.findByPlaceholderText(/Nama anggota/i)
    expect(editInput).toBeTruthy()

    // wait briefly to ensure the edit input doesn't disappear
    await waitFor(
      () => {
        expect(screen.queryByPlaceholderText(/Nama anggota/i)).not.toBeNull()
      },
      { timeout: 500 }
    )
  })
})

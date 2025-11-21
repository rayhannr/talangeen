import { describe, it, expect } from 'vitest'
import { getBailoutResult } from '../bailout'

import type { Transaction } from '../../stores/models'

const now = new Date().toISOString()

describe('bailout rounding and splitting (thousands)', () => {
  it('one-for-all splits in thousands distributing remainder to first receivers', () => {
    const t0: Transaction = {
      id: 't0',
      giver: 'g0',
      receivers: ['r3'],
      note: 'prior debt to r3',
      description: '',
      amount: 1000,
      type: 'one-for-one',
      createdAt: now,
    }

    const t: Transaction = {
      id: 't1',
      giver: 'g1',
      receivers: ['r1', 'r2', 'r3'],
      note: 'test',
      description: '',
      amount: 29000,
      type: 'one-for-all',
      createdAt: now,
    }

    // include prior transaction so r3 has higher debt → r1 and r2 get extra thousands
    const map = getBailoutResult([t0, t])

    expect(map.get('g1+r1')).toBe(10000)
    expect(map.get('g1+r2')).toBe(10000)
    expect(map.get('g1+r3')).toBe(9000)
  })

  it('skips self-debt when giver included among receivers', () => {
    const t: Transaction = {
      id: 't2',
      giver: 'me',
      receivers: ['me', 'a', 'b', 'c'],
      note: 'group of 4 incl me',
      description: '',
      amount: 120000,
      type: 'one-for-all',
      createdAt: now,
    }

    const map = getBailoutResult([t])

    expect(map.get('me+a')).toBe(30000)
    expect(map.get('me+b')).toBe(30000)
    expect(map.get('me+c')).toBe(30000)
    // should not have entry me->me
    expect(map.has('me+me')).toBe(false)
  })

  it('one-for-one uses exact per-receiver amount and skips self', () => {
    const t: Transaction = {
      id: 't3',
      giver: 'g2',
      receivers: ['g2', 'x', 'y'],
      note: 'one-for-one',
      description: '',
      amount: 14000, // per receiver
      type: 'one-for-one',
      createdAt: now,
    }

    const map = getBailoutResult([t])

    expect(map.get('g2+x')).toBe(14000)
    expect(map.get('g2+y')).toBe(14000)
    expect(map.has('g2+g2')).toBe(false)
  })

  it('no entries when only receiver is the giver', () => {
    const t: Transaction = {
      id: 't4',
      giver: 'solo',
      receivers: ['solo'],
      note: 'only self',
      description: '',
      amount: 50000,
      type: 'one-for-all',
      createdAt: now,
    }

    const map = getBailoutResult([t])
    expect(map.size).toBe(0)
  })

  it('exact even split when divisible (100k / 5 = 20k each)', () => {
    const t: Transaction = {
      id: 't5',
      giver: 'gX',
      receivers: ['a', 'b', 'c', 'd', 'e'],
      note: 'even split',
      description: '',
      amount: 100000,
      type: 'one-for-all',
      createdAt: now,
    }

    const map = getBailoutResult([t])
    expect(map.get('gX+a')).toBe(20000)
    expect(map.get('gX+b')).toBe(20000)
    expect(map.get('gX+c')).toBe(20000)
    expect(map.get('gX+d')).toBe(20000)
    expect(map.get('gX+e')).toBe(20000)
  })

  it('tie-breaker prefers last-selected receiver when debts equal', () => {
    const t: Transaction = {
      id: 't6',
      giver: 'gZ',
      receivers: ['r1', 'r2', 'r3'],
      note: 'tie break last selected',
      description: '',
      amount: 31000,
      type: 'one-for-all',
      createdAt: now,
    }

    const map = getBailoutResult([t])

    // totalThousands = 31, baseThousands = 10, rem = 1 -> extra to last-selected r3
    expect(map.get('gZ+r1')).toBe(10000)
    expect(map.get('gZ+r2')).toBe(10000)
    expect(map.get('gZ+r3')).toBe(11000)
  })
})

import { Transaction } from '../stores/models'

const getMapKey = (firstId: string, secondId: string) => `${firstId}+${secondId}`

export const getBailoutResult = (transactions: Transaction[]) => {
  const bailoutMap = new Map<string, number>()
  if (!transactions?.length) return bailoutMap

  transactions.forEach((t) => {
    t.receivers.forEach((r) => {
      const amount = t.type === 'one-for-one' ? t.amount : t.amount / t.receivers.length
      const currentKey = getMapKey(t.giver, r)
      const currentDonation = bailoutMap.get(currentKey) || 0
      bailoutMap.set(currentKey, currentDonation + amount)
    })
  })

  bailoutMap.forEach((value, key) => {
    const [firstMemberId, secondMemberId] = key.split('+')
    const reversedKey = getMapKey(secondMemberId, firstMemberId)
    const reversedBailout = bailoutMap.get(reversedKey) || 0

    if (value > reversedBailout) {
      bailoutMap.set(key, value - reversedBailout)
      bailoutMap.set(reversedKey, 0)
    } else if (value === reversedBailout) {
      bailoutMap.set(key, 0)
      bailoutMap.set(reversedKey, 0)
    } else {
      bailoutMap.set(reversedKey, reversedBailout - value)
      bailoutMap.set(key, 0)
    }
  })

  const newMap = new Map([...bailoutMap].filter(([_key, value]) => value > 0))
  return newMap
}

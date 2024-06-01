import { Transaction } from '../stores/models'

const getMapKey = (firstId: string, secondId: string) => `${firstId}+${secondId}`

// get who gives bailout to whom for how much
// the data will look like: Map({firstId}-{secondId}, amount)
// firstId if the id of the giver, the secondId is the receiver
export const getBailoutResult = (transactions: Transaction[]) => {
  const bailoutMap = new Map<string, number>()
  if (!transactions?.length) return bailoutMap

  transactions.forEach((t) => {
    t.receivers.forEach((r) => {
      const amount = t.type === 'one-for-one' ? t.amount : t.amount / t.receivers.length
      const fixedAmount = +amount.toFixed(3)
      const currentKey = getMapKey(t.giver, r)
      const currentDonation = bailoutMap.get(currentKey) || 0
      bailoutMap.set(currentKey, currentDonation + fixedAmount)
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

const getBailoutAccumulation = (transactions: Transaction[]) => {
  const accumulationMap = new Map<string, number>()
  if (!transactions?.length) return []

  transactions.forEach((t) => {
    const amount = t.type === 'one-for-one' ? t.amount * t.receivers.length : t.amount
    const fixedAmount = +amount.toFixed(3)

    const giverAccumulation = accumulationMap.get(t.giver) || 0
    accumulationMap.set(t.giver, giverAccumulation + fixedAmount)
    t.receivers.forEach((r) => {
      const amount = t.type === 'one-for-one' ? t.amount : t.amount / t.receivers.length
      const fixedAmount = +amount.toFixed(3)

      const receiverAccumulation = accumulationMap.get(r) || 0
      accumulationMap.set(r, receiverAccumulation - fixedAmount)
    })
  })

  const accumulations = [...accumulationMap].map(([key, value]) => ({ memberId: key, amount: value }))
  return accumulations
}

export const getBailoutResultV2 = (transactions: Transaction[]) => {
  const accumulations = getBailoutAccumulation(transactions)
  const givers = structuredClone(accumulations.filter((acc) => acc.amount > 0).sort((a, b) => a.amount - b.amount))
  const receivers = structuredClone(accumulations.filter((acc) => acc.amount <= 0).sort((a, b) => b.amount - a.amount))

  let giverIndex = 0
  let receiverIndex = 0

  const result: {
    giverId: string
    receiverId: string
    amount: number
  }[] = []

  while (giverIndex < givers.length && receiverIndex < receivers.length) {
    const giverAmount = givers[giverIndex].amount
    const receiverAmount = -receivers[receiverIndex].amount

    if (giverAmount > receiverAmount) {
      const diff = +(giverAmount - receiverAmount).toFixed(3)
      result.push({
        amount: receiverAmount,
        giverId: givers[giverIndex].memberId,
        receiverId: receivers[receiverIndex].memberId,
      })

      givers[giverIndex].amount = diff
      receivers[receiverIndex].amount = 0
      receiverIndex++
    } else if (receiverAmount > giverAmount) {
      const diff = +(receiverAmount - giverAmount).toFixed(3)
      result.push({
        amount: giverAmount,
        giverId: givers[giverIndex].memberId,
        receiverId: receivers[receiverIndex].memberId,
      })

      receivers[receiverIndex].amount = -diff
      givers[giverIndex].amount = 0
      giverIndex++
    } else {
      result.push({
        // giver or receiver amount doesn't matter
        amount: giverAmount,
        giverId: givers[giverIndex].memberId,
        receiverId: receivers[receiverIndex].memberId,
      })

      receivers[receiverIndex].amount = 0
      givers[giverIndex].amount = 0
      giverIndex++
      receiverIndex++
    }
  }

  const resultMap = new Map<string, number>()
  result.forEach((res) => {
    resultMap.set(getMapKey(res.giverId, res.receiverId), res.amount)
  })

  return resultMap
}

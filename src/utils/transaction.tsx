import { Transaction } from '../stores/models'
import { getMemberName } from './member'

export const getTotalAmount = (transaction: Transaction) => {
  const formattedAmount = transaction.amount.toLocaleString()
  const receiversTotal = transaction.receivers.length

  if (receiversTotal <= 1) return formattedAmount

  const amount =
    transaction.type === 'one-for-all' ? `${formattedAmount} / ${receiversTotal}` : `${formattedAmount} x ${receiversTotal}`

  return amount
}

export const getTypeDescription = (transaction: Transaction) => {
  const amount =
    transaction.type === 'one-for-one'
      ? transaction.amount.toLocaleString()
      : Math.round(transaction.amount / transaction.receivers.length).toLocaleString()
  return `Yang ditalangin masing-masing dapet ${amount}`
}

export const getReceiversName = (receivers: string[], isDetailed?: boolean, map?: Map<string, string>) => {
  const firstReceiver = getMemberName(receivers[0], map)
  if (receivers.length === 1) return firstReceiver

  if (isDetailed)
    return receivers.map((receiver, index) => {
      const isLast = index === receivers.length - 1
      return (
        <span key={receiver}>
          {getMemberName(receiver, map)}
          {!isLast && ', '}
        </span>
      )
    })

  return (
    <span>
      {firstReceiver} dan {receivers.length - 1} temannya
    </span>
  )
}

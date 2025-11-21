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
  const receiversTotal = transaction.receivers.length
  if (receiversTotal <= 1) return `Yang ditalangin masing-masing dapet ${transaction.amount.toLocaleString()}`

  const amountNum = Math.round(transaction.amount)

  if (transaction.type === 'one-for-one') {
    return `Yang ditalangin masing-masing dapet ${amountNum.toLocaleString()}`
  }

  // one-for-all: split in thousands and describe remainder distribution
  const unit = 1000
  const totalThousands = Math.round(amountNum / unit)
  const baseThousands = Math.floor(totalThousands / receiversTotal)
  const remThousands = totalThousands % receiversTotal

  if (remThousands === 0) return `Yang ditalangin masing-masing dapet ${(baseThousands * unit).toLocaleString()}`

  return `Yang ditalangin ${amountNum.toLocaleString()} / ${receiversTotal} = ${(
    baseThousands * unit
  ).toLocaleString()} (plus ${unit.toLocaleString()} untuk ${remThousands} orang)`
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

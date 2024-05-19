import { Transaction } from '../stores/models'

export const getTotalAmount = (transaction: Transaction) => {
  const formattedAmount = transaction.amount.toLocaleString()
  const receiversTotal = transaction.receivers.length
  const amount =
    transaction.type === 'one-for-all' || receiversTotal <= 1 ? formattedAmount : `${formattedAmount} x ${receiversTotal}`

  return amount
}

export const getTypeDescription = (transaction: Transaction) => {
  const amount =
    transaction.type === 'one-for-one'
      ? transaction.amount.toLocaleString()
      : (transaction.amount / transaction.receivers.length).toLocaleString()
  return `Yang ditalangin masing-masing dapet ${amount}`
}

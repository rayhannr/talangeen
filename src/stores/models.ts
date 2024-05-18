export interface Member {
  id: string
  name: string
}

export type TransactionType = 'one-for-one' | 'one-for-all'

export interface Transaction {
  id: string
  giver: string
  receivers: string[]
  note: string
  description?: string
  amount: number
  type: TransactionType
  createdAt: string
}

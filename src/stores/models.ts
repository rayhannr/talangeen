export interface Member {
  id: string
  name: string
}

export interface Transaction {
  id: string
  giver: string
  receivers: string[]
  note: string
  description?: string
  amount: number
  type: 'one-for-one' | 'one-for-many'
  createdAt: string
}

import { z } from 'zod'

const Member = z.object({
  id: z.string(),
  name: z.string(),
})
export interface Member extends z.TypeOf<typeof Member> {}

const TransactionType = z.enum(['one-for-one', 'one-for-all'])
export type TransactionType = z.TypeOf<typeof TransactionType>

const Transaction = z.object({
  id: z.string(),
  giver: z.string(),
  receivers: z.array(z.string()),
  note: z.string(),
  description: z.string().optional(),
  amount: z.number(),
  type: TransactionType,
  createdAt: z.string(),
})
export interface Transaction extends z.TypeOf<typeof Transaction> {}

export const ImportData = z.object({
  members: z.array(Member).optional(),
  transactions: z.array(Transaction).optional(),
})
export interface ImportData extends z.TypeOf<typeof ImportData> {}

export interface TableData {
  key: string
  receiver: string
  giver: string
  amount: number
}

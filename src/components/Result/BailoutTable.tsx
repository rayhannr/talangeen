import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, getKeyValue } from '@nextui-org/table'
import { useAtomValue } from 'jotai'
import { twMerge } from 'tailwind-merge'
import { membersMapAtom } from '../../stores'
import { getMemberName } from '../../utils/member'
import { Filter } from './BailoutFilter'

interface Props {
  bailouts: Map<string, number>
  filter: Filter
}

const columns = [
  {
    key: 'receiver',
    label: 'Yang Ditalangin',
  },
  {
    key: 'giver',
    label: 'Yang Nalangin',
  },
  {
    key: 'amount',
    label: 'Nominal',
  },
]

export const BailoutTable = ({ bailouts, filter }: Props) => {
  const membersMap = useAtomValue(membersMapAtom)

  const rows = [...bailouts]
    .map(([key, value]) => {
      const [giverId, receiverId] = key.split('+')

      return {
        key,
        receiver: receiverId,
        giver: giverId,
        amount: value,
      }
    })
    .filter((row) => {
      if (!filter.giver.length) return true
      return filter.giver.includes(row.giver)
    })
    .filter((row) => {
      if (!filter.receiver.length) return true
      return filter.receiver.includes(row.receiver)
    })
    .filter((row) => {
      if (filter.amount <= 0) return true
      return String(row.amount).includes(String(filter.amount))
    })

  return (
    <>
      <p className={twMerge('my-4', !bailouts.size && 'opacity-80 dark:opacity-60')}>
        {!bailouts.size
          ? 'Belum ada data yang bisa ditampilkan'
          : 'Berikut data uang yang harus dibayar orang yang ditalangin ke orang yang nalangin'}
      </p>
      {!!bailouts.size && (
        <Table
          radius="sm"
          shadow="none"
          isStriped
          isHeaderSticky
          aria-label="Tabel uang yang harus dibayar yang ditalangin ke yang nalangin"
        >
          <TableHeader columns={columns}>
            {(column) => <TableColumn key={column.key}>{column.label.toUpperCase()}</TableColumn>}
          </TableHeader>
          <TableBody items={rows}>
            {(item) => (
              <TableRow key={item.key}>
                <TableCell>{getMemberName(getKeyValue(item, 'receiver'), membersMap)}</TableCell>
                <TableCell>{getMemberName(getKeyValue(item, 'giver'), membersMap)}</TableCell>
                <TableCell>{getKeyValue(item, 'amount').toLocaleString()}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </>
  )
}

import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, getKeyValue } from '@nextui-org/table'
import { useAtomValue } from 'jotai'
import { twMerge } from 'tailwind-merge'
import { membersMapAtom } from '../../stores'
import { getMemberName } from '../../utils/member'

interface Props {
  bailouts: Map<string, number>
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
export const BailoutTable = ({ bailouts }: Props) => {
  const membersMap = useAtomValue(membersMapAtom)
  const rows = [...bailouts].map(([key, value]) => {
    const [giverId, receiverId] = key.split('+')

    return {
      key,
      receiver: getMemberName(receiverId, membersMap),
      giver: getMemberName(giverId, membersMap),
      amount: value.toLocaleString(),
    }
  })

  return (
    <>
      <p className={twMerge('mb-4', !bailouts.size && 'opacity-80 dark:opacity-60')}>
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
              <TableRow key={item.key}>{(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}</TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </>
  )
}

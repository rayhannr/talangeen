import { Accordion, AccordionItem } from '@nextui-org/accordion'
import { useAtomValue } from 'jotai'
import ArrowLongRightIcon from '@heroicons/react/24/outline/ArrowLongRightIcon'
import { membersMapAtom, transactionsAtom } from '../../stores'
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/table'

export const TransactionsList = () => {
  const membersMap = useAtomValue(membersMapAtom)
  const transactions = useAtomValue(transactionsAtom)

  const getMember = (memberId: string) => membersMap.get(memberId) || 'anggota terhapus'

  const getReceivers = (receivers: string[], isDetailed?: boolean) => {
    const firstReceiver = getMember(receivers[0])
    if (receivers.length === 1) return firstReceiver

    if (isDetailed) return receivers.map((receiver) => getMember(receiver)).join(', ')

    return `${firstReceiver} dan ${receivers.length - 1} temannya`
  }

  return (
    <Accordion isCompact variant="splitted" defaultExpandedKeys={[transactions[0].id]}>
      {transactions.map((transaction) => (
        <AccordionItem
          key={transaction.id}
          aria-label={transaction.note}
          className="!shadow-none border border-slate-300 dark:border-none"
          indicator={({ indicator }) => (
            <div className="flex gap-1 items-center">
              {<p className="text-foreground">{transaction.amount.toLocaleString()}</p>}
              {indicator}
            </div>
          )}
          disableIndicatorAnimation
          title={transaction.note}
          subtitle={
            <div className="flex gap-1">
              <p>{getMember(transaction.giver)}</p>
              <ArrowLongRightIcon className="w-5 h-5" />
              <p>{getReceivers(transaction.receivers)}</p>
            </div>
          }
        >
          <Table hideHeader radius="sm" shadow="none" isCompact removeWrapper>
            <TableHeader>
              <TableColumn>Column 1</TableColumn>
              <TableColumn>Column 2</TableColumn>
            </TableHeader>
            <TableBody>
              <TableRow key="1">
                <TableCell>Yang Nalangin</TableCell>
                <TableCell>{getMember(transaction.giver)}</TableCell>
              </TableRow>

              <TableRow key="2">
                <TableCell>Yang Ditalangin</TableCell>
                <TableCell>{getReceivers(transaction.receivers, true)}</TableCell>
              </TableRow>

              <TableRow key="3">
                <TableCell>Nominal</TableCell>
                <TableCell>{transaction.amount.toLocaleString()}</TableCell>
              </TableRow>

              <TableRow key="4">
                <TableCell>Tujuan</TableCell>
                <TableCell>{transaction.note || '-'}</TableCell>
              </TableRow>

              <TableRow key="5">
                <TableCell>Deskripsi</TableCell>
                <TableCell>{transaction.description || '-'}</TableCell>
              </TableRow>

              <TableRow key="6">
                <TableCell>Tanggal</TableCell>
                <TableCell>
                  {new Intl.DateTimeFormat('id', {
                    dateStyle: 'full',
                  }).format(new Date(transaction.createdAt))}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

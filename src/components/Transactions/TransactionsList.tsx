import { Accordion, AccordionItem } from '@nextui-org/accordion'
import { useAtomValue } from 'jotai'
import ArrowLongRightIcon from '@heroicons/react/24/outline/ArrowLongRightIcon'
import { membersMapAtom, transactionsAtom } from '../../stores'
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/table'
import { getTotalAmount, getTypeDescription } from '../../utils/transaction'
import { ScrollShadow } from '@nextui-org/scroll-shadow'

export const TransactionsList = () => {
  const membersMap = useAtomValue(membersMapAtom)
  const transactions = useAtomValue(transactionsAtom)

  const getMember = (memberId: string) => membersMap.get(memberId) || <i>anggota terhapus</i>

  const getReceivers = (receivers: string[], isDetailed?: boolean) => {
    const firstReceiver = getMember(receivers[0])
    if (receivers.length === 1) return firstReceiver

    if (isDetailed)
      return receivers.map((receiver, index) => {
        const isLast = index === receivers.length - 1
        return (
          <span>
            {getMember(receiver)}
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

  return (
    <ScrollShadow className="max-h-96 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-neutral-800 scrollbar-thumb-rounded-full scrollbar-track-transparent">
      <Accordion isCompact variant="splitted" defaultExpandedKeys={'0'}>
        {transactions.map((transaction, index) => (
          <AccordionItem
            key={String(index)}
            aria-label={transaction.note}
            className="!shadow-none border border-slate-300 dark:border-none"
            indicator={({ indicator }) => (
              <div className="flex gap-1 items-center">
                {<p className="text-foreground">{getTotalAmount(transaction)}</p>}
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
                  <TableCell>{getTotalAmount(transaction)}</TableCell>
                </TableRow>

                <TableRow key="4" className={transaction.receivers.length <= 1 ? 'hidden' : ''}>
                  <TableCell>Tipe Talangan</TableCell>
                  <TableCell>
                    <p>{transaction.type === 'one-for-one' ? 'Satu untuk satu' : 'Satu untuk semua'}</p>
                    <p className="opacity-80 dark:opacity-60">{getTypeDescription(transaction)}</p>
                  </TableCell>
                </TableRow>

                <TableRow key="5">
                  <TableCell>Tujuan</TableCell>
                  <TableCell>{transaction.note || '-'}</TableCell>
                </TableRow>

                <TableRow key="6">
                  <TableCell>Deskripsi</TableCell>
                  <TableCell>{transaction.description || '-'}</TableCell>
                </TableRow>

                <TableRow key="7">
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
      <div className="py-2"></div>
    </ScrollShadow>
  )
}

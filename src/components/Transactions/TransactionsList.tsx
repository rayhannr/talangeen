import { Accordion, AccordionItem } from '@nextui-org/accordion'
import { useAtomValue } from 'jotai'
import ArrowLongRightIcon from '@heroicons/react/24/outline/ArrowLongRightIcon'
import { membersMapAtom } from '../../stores'
import { getReceiversName, getTotalAmount } from '../../utils/transaction'
import { ScrollShadow } from '@nextui-org/scroll-shadow'
import { TransactionDetail } from './TransactionDetail'
import { getMemberName } from '../../utils/member'
import { Transaction } from '../../stores/models'

interface Props {
  transactions: Transaction[]
}

export const TransactionsList = ({ transactions }: Props) => {
  const membersMap = useAtomValue(membersMapAtom)

  return (
    <ScrollShadow className="max-h-96 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-neutral-800 scrollbar-thumb-rounded-full scrollbar-track-transparent">
      <Accordion isCompact variant="splitted" defaultExpandedKeys={'0'}>
        {transactions.map((transaction, index) => (
          <AccordionItem
            key={String(index)}
            textValue={transaction.note}
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
                <p>{getMemberName(transaction.giver, membersMap)}</p>
                <ArrowLongRightIcon className="w-5 h-5" />
                <p>{getReceiversName(transaction.receivers, false, membersMap)}</p>
              </div>
            }
          >
            <TransactionDetail transaction={transaction} />
          </AccordionItem>
        ))}
      </Accordion>
      <div className="py-2"></div>
    </ScrollShadow>
  )
}

import { useState } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/table'
import { Tooltip } from '@nextui-org/tooltip'
import { Button } from '@nextui-org/button'
import { Modal, ModalContent, ModalHeader, useDisclosure } from '@nextui-org/modal'
import PencilSquareIcon from '@heroicons/react/24/outline/PencilSquareIcon'
import TrashIcon from '@heroicons/react/24/outline/TrashIcon'
import { membersMapAtom, transactionsAtom } from '../../stores'
import { Transaction } from '../../stores/models'
import { getMemberName } from '../../utils/member'
import { getReceiversName, getTotalAmount, getTypeDescription } from '../../utils/transaction'
import { TransactionForm } from './TransactionForm'
import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/popover'

interface Props {
  transaction: Transaction
}

export const TransactionDetail = ({ transaction }: Props) => {
  const membersMap = useAtomValue(membersMapAtom)
  const setTransactions = useSetAtom(transactionsAtom)
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [isDeleting, setIsDeleting] = useState(false)

  const removeTransaction = () => {
    setTransactions((transactions) => (transactions as Transaction[]).filter((t) => t.id !== transaction.id))
    setIsDeleting(false)
  }

  return (
    <>
      <Table hideHeader radius="sm" shadow="none" isCompact removeWrapper aria-label="Detail transaksi">
        <TableHeader>
          <TableColumn>Column 1</TableColumn>
          <TableColumn>Column 2</TableColumn>
        </TableHeader>
        <TableBody>
          <TableRow key="1">
            <TableCell>Yang Nalangin</TableCell>
            <TableCell>{getMemberName(transaction.giver, membersMap)}</TableCell>
          </TableRow>

          <TableRow key="2">
            <TableCell>Yang Ditalangin</TableCell>
            <TableCell>{getReceiversName(transaction.receivers, true, membersMap)}</TableCell>
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

          <TableRow key="8">
            <TableCell>Aksi</TableCell>
            <TableCell>
              <div className="flex">
                <Tooltip content="Edit">
                  <Button isIconOnly size="sm" variant="light" onClick={onOpen}>
                    <PencilSquareIcon className="w-5 h-5" />
                  </Button>
                </Tooltip>

                <Popover
                  isOpen={isDeleting}
                  onOpenChange={setIsDeleting}
                  placement="bottom"
                  showArrow
                  classNames={{ content: 'max-w-80' }}
                  backdrop="opaque"
                  radius="sm"
                >
                  <PopoverTrigger>
                    <Button isIconOnly size="sm" variant="light">
                      <Tooltip content="Hapus">
                        <TrashIcon className="w-5 h-5" />
                      </Tooltip>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <div className="flex justify-between items-center gap-4">
                      Yakin mau hapus transaksi ini?
                      <Button size="sm" variant="flat" color="danger" onClick={removeTransaction}>
                        Hapus
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Edit Transaksi</ModalHeader>
              <TransactionForm onClose={onClose} transaction={transaction} />
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

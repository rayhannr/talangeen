import { Button } from '@nextui-org/button'
import { Modal, ModalContent, ModalHeader, useDisclosure } from '@nextui-org/modal'
import { Tooltip } from '@nextui-org/tooltip'
import { useAtomValue } from 'jotai'
import PlusIcon from '@heroicons/react/24/outline/PlusIcon'
import { TransactionForm } from './TransactionForm'
import { transactionsAtom } from '../../stores'
import { TransactionsList } from './TransactionsList'

export const Transactions = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const transactions = useAtomValue(transactionsAtom)

  return (
    <div className="flex-grow">
      <div className="flex flex-wrap justify-between items-center mb-2">
        <p className="font-bold">Transaksi</p>
        <Tooltip content="Tambah transaksi">
          <Button isIconOnly variant="flat" isDisabled={isOpen} onClick={onOpen} radius="sm">
            <PlusIcon className="w-5 h-5" />
          </Button>
        </Tooltip>
      </div>

      {!transactions.length && <p className="text-center opacity-80 dark:opacity-60">Belum ada transaksi</p>}
      <TransactionsList />
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Tambah Transaksi</ModalHeader>
              <TransactionForm onClose={onClose} />
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}

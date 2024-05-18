import { Button } from '@nextui-org/button'
import { Modal, ModalContent, ModalHeader, useDisclosure } from '@nextui-org/modal'
import { Tooltip } from '@nextui-org/tooltip'
import PlusIcon from '@heroicons/react/24/outline/PlusIcon'
import { TransactionForm } from './TransactionForm'

export const Transactions = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

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

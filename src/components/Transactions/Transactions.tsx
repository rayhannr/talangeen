import { ChangeEvent, useState } from 'react'
import { Button } from '@nextui-org/button'
import { Input } from '@nextui-org/input'
import { Modal, ModalContent, ModalHeader, useDisclosure } from '@nextui-org/modal'
import { Select, SelectItem } from '@nextui-org/select'
import { Tooltip } from '@nextui-org/tooltip'
import { useAtomValue } from 'jotai'
import PlusIcon from '@heroicons/react/24/outline/PlusIcon'
import MagnifyingGlassIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon'
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
import { useDebounce } from 'use-debounce'
import { TransactionForm } from './TransactionForm'
import { membersAtom, membersMapAtom, transactionsAtom } from '../../stores'
import { TransactionsList } from './TransactionsList'
import { ResetData } from '../ResetData'

type FilterBy = 'giver' | 'receiver' | 'note'
const filterByOptions = [
  {
    label: 'Yang Nalangin',
    value: 'giver',
  },
  {
    label: 'Yang Ditalangin',
    value: 'receiver',
  },
  {
    label: 'Tujuan',
    value: 'note',
  },
]

export const Transactions = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const members = useAtomValue(membersAtom)
  const membersMap = useAtomValue(membersMapAtom)
  const transactions = useAtomValue(transactionsAtom)

  const [isSearching, setIsSearching] = useState(false)
  const [filterBy, setFilterBy] = useState<FilterBy>('giver')
  const [keyword, setKeyword] = useState('')
  const [debouncedKeyword] = useDebounce(keyword.toLowerCase(), 500)
  const filteredTransactions = transactions.filter((transaction) => {
    if (!debouncedKeyword.trim()) return true

    switch (filterBy) {
      case 'note':
        return transaction.note.toLowerCase().includes(debouncedKeyword)
      case 'giver': {
        const giverName = membersMap.get(transaction.giver)?.toLowerCase()
        return giverName?.includes(debouncedKeyword)
      }
      default:
        return transaction.receivers.some((receiver) => {
          const receiverName = membersMap.get(receiver)?.toLowerCase()
          return receiverName?.includes(debouncedKeyword)
        })
    }
  })

  const onFilterByChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target
    setFilterBy(value as FilterBy)
    setKeyword('')
  }

  const onKeywordChange = (value: string) => {
    setKeyword(value)
  }

  const getKeywordPlaceholder = () => {
    if (filterBy === 'note') return `e.g. ${transactions?.[0].note || 'Tiket masuk Obelix Sea View'}`

    return `e.g. ${members?.[0].name || 'Justin'}`
  }

  return (
    <div className="flex-grow">
      <div className="flex flex-wrap justify-between items-center mb-2 px-2">
        <p className="font-bold">Transaksi</p>
        <div className="flex gap-1">
          {!!transactions.length && !isSearching && (
            <Tooltip content="Cari transaksi">
              <Button isIconOnly variant="flat" onClick={() => setIsSearching(true)} radius="sm">
                <MagnifyingGlassIcon className="w-5 h-5" />
              </Button>
            </Tooltip>
          )}
          <Tooltip content="Tambah transaksi">
            <Button isIconOnly variant="flat" isDisabled={isOpen} onClick={onOpen} radius="sm">
              <PlusIcon className="w-5 h-5" />
            </Button>
          </Tooltip>
        </div>
      </div>
      {!transactions.length && <p className="text-center opacity-80 dark:opacity-60">Belum ada transaksi</p>}
      {isSearching && (
        <div className="flex gap-1 px-2 flex-col md:flex-row mb-2">
          <Select
            selectedKeys={[filterBy]}
            radius="sm"
            variant="bordered"
            placeholder="Cari berdasarkan"
            items={filterByOptions}
            onChange={onFilterByChange}
            className="md:max-w-44"
          >
            {(option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            )}
          </Select>
          <div className="flex gap-1 flex-grow">
            <Input
              value={keyword}
              variant="bordered"
              radius="sm"
              placeholder={getKeywordPlaceholder()}
              onValueChange={onKeywordChange}
              className="flex-grow"
            />
            <Button isIconOnly variant="flat" onClick={() => setIsSearching(false)} radius="sm">
              <XMarkIcon className="w-5 h-5" />
            </Button>
          </div>
        </div>
      )}
      {!filteredTransactions.length && isSearching && (
        <p className="text-center opacity-80 dark:opacity-60">Transaksi yang lu cari kagak ada</p>
      )}
      <TransactionsList transactions={filteredTransactions} />
      <ResetData type="transaction" />
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top">
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

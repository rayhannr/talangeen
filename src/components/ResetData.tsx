import { useState } from 'react'
import { Button } from '@nextui-org/button'
import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/popover'
import { useAtom } from 'jotai'
import { membersAtom, transactionsAtom } from '../stores'

interface Props {
  type: 'transaction' | 'member'
}

export const ResetData = ({ type }: Props) => {
  const [isResetting, setIsResetting] = useState(false)
  const [members, setMembers] = useAtom(membersAtom)
  const [transactions, setTransactions] = useAtom(transactionsAtom)

  const reset = () => {
    if (type === 'member') {
      setMembers([])
    } else {
      setTransactions([])
    }
    setIsResetting(false)
  }

  if ((type === 'member' && !members?.length) || (type === 'transaction' && !transactions?.length)) return null

  return (
    <Popover isOpen={isResetting} onOpenChange={setIsResetting} placement="bottom" showArrow backdrop="opaque" radius="sm">
      <PopoverTrigger>
        <Button className="mx-auto block" radius="sm" variant="flat">
          {`Reset ${type === 'transaction' ? 'Transaksi' : 'Anggota'}`}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-3">
        {`Ini bakal hapus semua data ${type === 'transaction' ? 'transaksi' : 'anggota'}. Lu yakin?`}
        <div className="w-full flex justify-end mt-3">
          <Button size="sm" variant="flat" color="danger" onPress={reset}>
            Reset
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

import { useEffect, useState } from 'react'
import { Button } from '@nextui-org/button'
import { Tooltip } from '@nextui-org/tooltip'
import { useAtomValue } from 'jotai'
import CalculatorIcon from '@heroicons/react/24/outline/CalculatorIcon'
import { twMerge } from 'tailwind-merge'
import { membersAtom, store, transactionsAtom } from '../../stores'
import { getBailoutResult } from '../../utils/bailout'
import { BailoutTable } from './BailoutTable'

export const Result = () => {
  const transactions = useAtomValue(transactionsAtom)
  const [bailouts, setBailouts] = useState<Map<string, number>>(new Map())
  const [isUpdated, setIsUpdated] = useState(false)

  const generateResult = () => {
    setIsUpdated(false)
    const bailoutMap = getBailoutResult(transactions)
    setBailouts(bailoutMap)
  }

  useEffect(() => {
    const update = () => {
      setIsUpdated(true)
    }

    const unsubMembers = store.sub(membersAtom, update)
    const unsubTransactions = store.sub(transactionsAtom, update)

    return () => {
      unsubMembers()
      unsubTransactions()
    }
  }, [])

  useEffect(() => {
    window.scrollBy({ top: 200, behavior: 'smooth' })
  }, [bailouts.size])

  return (
    <div className="flex flex-col px-2">
      <div className="flex justify-between gap-5 items-center mb-2">
        <p className="font-bold">Hasil</p>
        <div className="flex items-center justify-end gap-2">
          {isUpdated && bailouts.size && (
            <span className="opacity-80 dark:opacity-60 text-sm text-pretty">
              Ada perubahan data anggota atau transaksi. Silakan hitung ulang.
            </span>
          )}
          <Tooltip content="Hitung hasil">
            <Button isIconOnly variant="flat" isDisabled={!transactions.length} onClick={generateResult} radius="sm">
              <CalculatorIcon className="w-5 h-5" />
            </Button>
          </Tooltip>
        </div>
      </div>
      <p className={twMerge('mb-4', !bailouts.size && 'opacity-80 dark:opacity-60')}>
        {!bailouts.size
          ? 'Belum ada data yang bisa ditampilkan'
          : 'Berikut data uang yang harus dibayar orang yang ditalangin ke orang yang nalangin'}
      </p>
      <BailoutTable bailouts={bailouts} />
    </div>
  )
}

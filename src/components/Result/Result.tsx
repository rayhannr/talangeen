import { useEffect, useState } from 'react'
import { Button } from '@nextui-org/button'
import { Tooltip } from '@nextui-org/tooltip'
import { useAtomValue } from 'jotai'
import CalculatorIcon from '@heroicons/react/24/outline/CalculatorIcon'
import { store, transactionsAtom } from '../../stores'
import { getBailoutResult, getBailoutResultV2 } from '../../utils/bailout'
import { BailoutTable } from './BailoutTable'
import { Tab, Tabs } from '@nextui-org/tabs'

export const Result = () => {
  const transactions = useAtomValue(transactionsAtom)
  const [bailoutsV1, setBailoutsV1] = useState<Map<string, number>>(new Map())
  const [bailoutsV2, setBailoutsV2] = useState<Map<string, number>>(new Map())
  const [isUpdated, setIsUpdated] = useState(false)

  const generateResult = () => {
    setIsUpdated(false)
    const bailoutMapV1 = getBailoutResult(transactions)
    const bailoutMapV2 = getBailoutResultV2(transactions)

    setBailoutsV1(bailoutMapV1)
    setBailoutsV2(bailoutMapV2)
  }

  useEffect(() => {
    const update = () => {
      setIsUpdated(true)
    }

    const unsubTransactions = store.sub(transactionsAtom, update)

    return () => {
      unsubTransactions()
    }
  }, [])

  useEffect(() => {
    if (!bailoutsV1.size) return
    window.scrollBy({ top: 200, behavior: 'smooth' })
  }, [bailoutsV1.size])

  return (
    <div className="flex flex-col px-2">
      <div className="flex justify-between gap-5 items-center mb-2">
        <p className="font-bold">Hasil</p>
        <div className="flex items-center justify-end gap-2">
          {isUpdated && !!bailoutsV1.size && (
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
      <Tabs>
        <Tab key="1" title="Versi 1">
          <BailoutTable bailouts={bailoutsV1} />
        </Tab>
        <Tab key="2" title="Versi 2">
          <BailoutTable bailouts={bailoutsV2} />
        </Tab>
      </Tabs>
    </div>
  )
}

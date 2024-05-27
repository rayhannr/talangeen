import { useEffect, useState } from 'react'
import { Button } from '@nextui-org/button'
import { Tooltip } from '@nextui-org/tooltip'
import { Tab, Tabs } from '@nextui-org/tabs'
import { useAtomValue } from 'jotai'
import CalculatorIcon from '@heroicons/react/24/outline/CalculatorIcon'
import InformationCircleIcon from '@heroicons/react/24/outline/InformationCircleIcon'
import { store, transactionsAtom } from '../../stores'
import { getBailoutResult, getBailoutResultV2 } from '../../utils/bailout'
import { BailoutTable } from './BailoutTable'
import { useDisclosure } from '@nextui-org/modal'
import { InfoModalV1 } from './InfoModalV1'
import { InfoModalV2 } from './InfoModalV2'
import { BailoutFilter, Filter } from './BailoutFilter'
import { useSimpleReducer } from '../../hooks/reducer'

export const Result = () => {
  const transactions = useAtomValue(transactionsAtom)
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [bailoutsV1, setBailoutsV1] = useState<Map<string, number>>(new Map())
  const [bailoutsV2, setBailoutsV2] = useState<Map<string, number>>(new Map())
  const [isUpdated, setIsUpdated] = useState(false)
  const [selectedTab, setSelectedTab] = useState('1')
  const [filter, setFilter] = useSimpleReducer<Filter>({ giver: [], receiver: [], amount: -1 })

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
            <Button isIconOnly variant="flat" onClick={generateResult} radius="sm">
              <CalculatorIcon className="w-5 h-5" />
            </Button>
          </Tooltip>
        </div>
      </div>

      <div className="flex gap-2">
        <Tabs selectedKey={selectedTab} disableAnimation onSelectionChange={(tab) => setSelectedTab(tab as string)} radius="sm">
          <Tab key="1" title="Versi 1" />
          <Tab key="2" title="Versi 2" />
        </Tabs>
        <Tooltip content="Info">
          <Button isIconOnly radius="sm" onPress={onOpen} variant="light">
            <InformationCircleIcon className="w-5 h-5 opacity-80 dark:opacity-60" />
          </Button>
        </Tooltip>
      </div>
      {(!!bailoutsV1.size || !!bailoutsV2.size) && (
        <BailoutFilter onFilterChange={(key, value) => setFilter({ [key]: value })} />
      )}
      {selectedTab === '1' && <BailoutTable bailouts={bailoutsV1} filter={filter} />}
      {selectedTab === '2' && <BailoutTable bailouts={bailoutsV2} filter={filter} />}
      <InfoModalV1 onOpenChange={onOpenChange} isOpen={isOpen && selectedTab === '1'} />
      <InfoModalV2 onOpenChange={onOpenChange} isOpen={isOpen && selectedTab === '2'} />
    </div>
  )
}

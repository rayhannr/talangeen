import { ChangeEvent, useState } from 'react'
import { useAtom } from 'jotai'
import { Button } from '@nextui-org/button'
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/dropdown'
import { saveAs } from 'file-saver'
import Bars3Icon from '@heroicons/react/24/outline/Bars3Icon'
import BarsArrowUpIcon from '@heroicons/react/24/outline/BarsArrowUpIcon'
import BarsArrowDownIcon from '@heroicons/react/24/outline/BarsArrowDownIcon'
import { Github } from './Icons/Github'
import { membersAtom, transactionsAtom } from '../stores'
import { ImportData } from '../stores/models'
import { z } from 'zod'
import { ImportFailedModal } from './ImportFailedModal'
import { ImportWarningModal } from './ImportWarningModal'

export const Menu = () => {
  const [members, setMembers] = useAtom(membersAtom)
  const [transactions, setTransactions] = useAtom(transactionsAtom)

  const [dataToImport, setDataToImport] = useState<ImportData | null>(null)
  const [zodErrors, setZodErrors] = useState<z.ZodIssue[]>([])
  const [isImportError, setIsImportError] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const exportData = () => {
    const data = { members, transactions }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const now = new Date().toLocaleString()
    saveAs(blob, `talangeen-data_${now}.json`)
    setIsDropdownOpen(false)
  }

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target
    if (!files?.length) return

    const pickedFile = files[0]
    const reader = new FileReader()
    reader.onload = function (_event) {
      const result = JSON.parse(JSON.stringify(reader.result))
      try {
        const data = ImportData.safeParse(JSON.parse(result))
        if (data.error) {
          setZodErrors(data.error.errors)
          return
        }
        setDataToImport(data.data)
      } catch (error) {
        setIsImportError(true)
        console.error(error)
      }
    }
    reader.readAsText(pickedFile, 'UTF-8')
    reader.onerror = function (_event) {
      setIsImportError(true)
      console.error(reader.error)
    }

    setIsDropdownOpen(false)
    event.target.value = ''
  }

  const clearImportData = () => {
    setDataToImport(null)
  }

  const importData = () => {
    if (!dataToImport) return
    const { members = [], transactions = [] } = dataToImport
    setMembers(members)
    setTransactions(transactions)
  }

  const clearImportError = () => {
    setIsImportError(false)
    setZodErrors([])
  }

  return (
    <>
      <Dropdown
        placement="bottom-end"
        className="min-w-44"
        radius="sm"
        closeOnSelect={false}
        isOpen={isDropdownOpen}
        onOpenChange={setIsDropdownOpen}
      >
        <DropdownTrigger>
          <Button isIconOnly variant="light" radius="full">
            <Bars3Icon className="w-5 h-5" />
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="static menu">
          <DropdownItem key="issue" className="text-right" textValue="Laporkan bug">
            <a href="https://github.com/rayhannr/talangeen/issues/new" target="_blank" rel="noreferrer">
              Laporkan bug <Github className="w-5 h-5 inline-block ml-2" />
            </a>
          </DropdownItem>
          <DropdownItem key="import" className="text-right" textValue="Impor data">
            <label className="cursor-pointer">
              Impor data <BarsArrowDownIcon className="w-5 h-5 inline-block ml-2" />
              <input className="sr-only" type="file" accept=".json" name="file-import" onChange={onFileChange} />
            </label>
          </DropdownItem>
          <DropdownItem key="export" onPress={exportData} className="text-right" textValue="Ekspor data">
            Ekspor data <BarsArrowUpIcon className="w-5 h-5 inline-block ml-2" />
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <ImportFailedModal isOpen={isImportError || !!zodErrors.length} onClose={clearImportError} zodErrors={zodErrors} />
      <ImportWarningModal isOpen={!!dataToImport} onClose={clearImportData} onSubmit={importData} />
    </>
  )
}

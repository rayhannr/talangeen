import { useAtomValue } from 'jotai'
import { Button } from '@nextui-org/button'
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/dropdown'
import { saveAs } from 'file-saver'
import Bars3Icon from '@heroicons/react/24/outline/Bars3Icon'
import BarsArrowUpIcon from '@heroicons/react/24/outline/BarsArrowUpIcon'
import { Github } from './Icons/Github'
import { membersAtom, transactionsAtom } from '../stores'

export const Menu = () => {
  const members = useAtomValue(membersAtom)
  const transactions = useAtomValue(transactionsAtom)

  const exportData = () => {
    const data = { members, transactions }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const now = new Date().toLocaleString()
    saveAs(blob, `talangeen-data_${now}.json`)
  }
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button isIconOnly variant="light" radius="full">
          <Bars3Icon className="w-5 h-5" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="static menu">
        <DropdownItem key="issue">
          <a href="https://github.com/rayhannr/talangeen/issues/new" target="_blank" rel="noreferrer">
            <Github className="w-5 h-5 inline-block mr-2" /> Laporkan bug
          </a>
        </DropdownItem>
        <DropdownItem key="export" onPress={exportData}>
          <BarsArrowUpIcon className="w-5 h-5 inline-block mr-2" /> Ekspor data
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}

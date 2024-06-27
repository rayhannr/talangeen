import { useState } from 'react'
import ClipboardDocumentCheckIcon from '@heroicons/react/24/outline/ClipboardDocumentCheckIcon'
import ClipboardIcon from '@heroicons/react/24/outline/ClipboardIcon'
import { Button } from '@nextui-org/button'
import { Tooltip } from '@nextui-org/tooltip'
import { TableData } from '../../stores/models'
import { useAtomValue } from 'jotai'
import { membersMapAtom } from '../../stores'
import { getMemberName } from '../../utils/member'

interface Props {
  data: TableData[]
}

export const CopyButton = ({ data }: Props) => {
  const [isCopied, setIsCopied] = useState(false)
  const membersMap = useAtomValue(membersMapAtom)

  const copy = () => {
    setIsCopied(true)
    const copiedText = data
      .map(
        (d) =>
          `- ${getMemberName(d.receiver, membersMap, true)} → ${getMemberName(
            d.giver,
            membersMap,
            true
          )}: ${d.amount.toLocaleString()}`
      )
      .join('\n')

    navigator.clipboard.writeText(copiedText)
    setTimeout(() => {
      setIsCopied(false)
    }, 3000)
  }

  return (
    <Tooltip content="Salin hasil">
      <Button isIconOnly variant="flat" radius="sm" onClick={copy}>
        {isCopied ? <ClipboardDocumentCheckIcon className="w-5 h-5" /> : <ClipboardIcon className="w-5 h-5" />}
      </Button>
    </Tooltip>
  )
}

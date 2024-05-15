import { FormEvent, useState } from 'react'
import { useSetAtom } from 'jotai'
import { Button } from '@nextui-org/button'
import { Input } from '@nextui-org/input'
import CheckIcon from '@heroicons/react/24/outline/CheckIcon'
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
import { Member } from '../../stores/models'
import { membersAtom } from '../../stores'

interface Props {
  onFinish: () => void
}

export const AddMember = ({ onFinish }: Props) => {
  const [value, setValue] = useState('')
  const [isTouched, setIsTouched] = useState(false)
  const setMembers = useSetAtom(membersAtom)

  const isInvalid = !value.trim() && isTouched

  const addMember = (event: FormEvent) => {
    event.preventDefault()
    setMembers((members) => [...(members as Member[]), { name: value, id: crypto.randomUUID() }])
    onFinish()
  }

  return (
    <form className="flex gap-1" onSubmit={addMember}>
      <Input
        placeholder="Nama anggota"
        className="flex-grow"
        isInvalid={isInvalid}
        errorMessage={isInvalid && 'Nama anggota gak boleh kosong'}
        value={value}
        onValueChange={(value) => {
          setValue(value)
          setIsTouched(true)
        }}
        maxLength={50}
        radius="sm"
      />
      <Button isIconOnly variant="flat" type="submit" radius="sm">
        <CheckIcon className="w-5 h-5" />
      </Button>
      <Button isIconOnly variant="flat" type="submit" radius="sm" onClick={onFinish}>
        <XMarkIcon className="w-5 h-5" />
      </Button>
    </form>
  )
}

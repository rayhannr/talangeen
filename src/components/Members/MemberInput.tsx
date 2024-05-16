import { FormEvent, useState } from 'react'
import { Button } from '@nextui-org/button'
import { Input } from '@nextui-org/input'
import CheckIcon from '@heroicons/react/24/outline/CheckIcon'
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
import { Member } from '../../stores/models'
import { MAX_MEMBER_NAME_LENGTH } from '../../constants'

interface Props {
  onSubmit: (member: Member) => void
  onCancel: () => void
  selectedMember?: Member
}

export const MemberInput = ({ onSubmit, onCancel, selectedMember }: Props) => {
  const [value, setValue] = useState(selectedMember?.name || '')
  const [isTouched, setIsTouched] = useState(false)

  const isInvalid = !value.trim() && isTouched

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    onSubmit({ name: value, id: selectedMember?.id || crypto.randomUUID() })
  }

  return (
    <form className="flex gap-1" onSubmit={handleSubmit}>
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
        maxLength={MAX_MEMBER_NAME_LENGTH}
        variant="bordered"
        radius="sm"
        isClearable
      />
      <Button isIconOnly variant="flat" type="submit" radius="sm">
        <CheckIcon className="w-5 h-5" />
      </Button>
      <Button isIconOnly variant="flat" type="submit" radius="sm" onClick={onCancel}>
        <XMarkIcon className="w-5 h-5" />
      </Button>
    </form>
  )
}

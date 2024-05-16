import { Card, CardBody } from '@nextui-org/card'
import { useSetAtom } from 'jotai'
import TrashIcon from '@heroicons/react/24/outline/TrashIcon'
import PencilSquareIcon from '@heroicons/react/24/outline/PencilSquareIcon'
import { Member } from '../../stores/models'
import { membersAtom } from '../../stores'
import { Button } from '@nextui-org/button'
import { useState } from 'react'
import { MemberInput } from './MemberInput'

interface Props {
  member: Member
}

export const MemberCard = ({ member }: Props) => {
  const setMembers = useSetAtom(membersAtom)
  const [isEditing, setIsEditing] = useState(false)

  const removeMember = (member: Member) => {
    setMembers((members) => (members as Member[]).filter((m) => m.id !== member.id))
  }

  const editMember = (editedMember: Member) => {
    setMembers((members) => {
      const copiedMembers = structuredClone(members as Member[])
      const editedMemberIndex = copiedMembers.findIndex((member) => member.id === editedMember.id)
      copiedMembers[editedMemberIndex] = editedMember

      return copiedMembers
    })
    setIsEditing(false)
  }

  if (isEditing) {
    return <MemberInput selectedMember={member} onSubmit={editMember} onCancel={() => setIsEditing(false)} />
  }

  return (
    <Card radius="sm" shadow="none" className="border border-slate-300 dark:border-none">
      <CardBody title={member.name} className="py-1 pr-1">
        <div className="flex justify-between items-center">
          {member.name}
          <div className="flex">
            <Button isIconOnly size="sm" variant="light" onClick={() => setIsEditing(true)}>
              <PencilSquareIcon className="w-5 h-5" />
            </Button>
            <Button isIconOnly size="sm" variant="light" onClick={() => removeMember(member)}>
              <TrashIcon className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

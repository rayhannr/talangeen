import { useState } from 'react'
import { Card, CardBody } from '@nextui-org/card'
import { useSetAtom } from 'jotai'
import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/popover'
import { Tooltip } from '@nextui-org/tooltip'
import TrashIcon from '@heroicons/react/24/outline/TrashIcon'
import PencilSquareIcon from '@heroicons/react/24/outline/PencilSquareIcon'
import { Member } from '../../stores/models'
import { membersAtom } from '../../stores'
import { Button } from '@nextui-org/button'
import { MemberInput } from './MemberInput'

interface Props {
  member: Member
}

export const MemberCard = ({ member }: Props) => {
  const setMembers = useSetAtom(membersAtom)
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const removeMember = (member: Member) => {
    setMembers((members) => (members as Member[]).filter((m) => m.id !== member.id))
    setIsDeleting(false)
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
            <Tooltip content="Edit">
              <Button isIconOnly size="sm" variant="light" onClick={() => setIsEditing(true)}>
                <PencilSquareIcon className="w-5 h-5" />
              </Button>
            </Tooltip>
            <Popover
              isOpen={isDeleting}
              onOpenChange={setIsDeleting}
              placement="bottom"
              showArrow
              classNames={{ content: 'max-w-80' }}
              backdrop="opaque"
              radius="sm"
            >
              <PopoverTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <Tooltip content="Hapus">
                    <TrashIcon className="w-5 h-5" />
                  </Tooltip>
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <div className="text-left">
                  Transaksi yang melibatkan anggota ini gak kehapus, tapi jadi gajelas siapa nalangin siapa.
                  <br />
                  <br />
                  <div className="flex justify-between items-center">
                    Yakin masih mau hapus?
                    <Button size="sm" variant="flat" color="danger" onClick={() => removeMember(member)}>
                      Hapus
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

import { Card, CardBody } from '@nextui-org/card'
import { useSetAtom } from 'jotai'
import TrashIcon from '@heroicons/react/24/outline/TrashIcon'
import { Member } from '../../stores/models'
import { membersAtom } from '../../stores'

interface Props {
  member: Member
}

export const MemberCard = ({ member }: Props) => {
  const setMembers = useSetAtom(membersAtom)

  const removeMember = (member: Member) => {
    setMembers((members) => (members as Member[]).filter((m) => m.id !== member.id))
  }

  return (
    <Card radius="sm" shadow="none" className="border border-slate-300 dark:border-none">
      <CardBody title={member.name}>
        <div className="flex justify-between items-center">
          {member.name}
          <TrashIcon className="w-5 h-5" onClick={() => removeMember(member)} role="button" />
        </div>
      </CardBody>
    </Card>
  )
}

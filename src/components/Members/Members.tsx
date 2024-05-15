import { useState } from 'react'
import { useAtomValue } from 'jotai'
import { Button } from '@nextui-org/button'
import PlusIcon from '@heroicons/react/24/outline/PlusIcon'
import { membersAtom } from '../../stores'
import { AddMember } from './AddMember'
import { MemberCard } from './MemberCard'

export const Members = () => {
  const members = useAtomValue(membersAtom)
  const [isAdding, setIsAdding] = useState(false)

  return (
    <div className="flex-grow">
      <div className="flex flex-wrap justify-between items-center mb-3">
        <p className="font-bold">Anggota</p>
        <Button isIconOnly variant="flat" isDisabled={isAdding} onClick={() => setIsAdding(true)}>
          <PlusIcon className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex flex-col gap-2 mb-2">
        {!members.length && !isAdding && <p className="text-center opacity-80 dark:opacity-60">Belum ada anggota</p>}
        {members.map((member) => (
          <MemberCard key={member.id} member={member} />
        ))}
      </div>
      {isAdding && <AddMember onFinish={() => setIsAdding(false)} />}
    </div>
  )
}

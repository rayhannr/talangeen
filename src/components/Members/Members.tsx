import { useState } from 'react'
import { useAtom } from 'jotai'
import { Button } from '@nextui-org/button'
import PlusIcon from '@heroicons/react/24/outline/PlusIcon'
import MagnifyingGlassIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon'
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
import { membersAtom } from '../../stores'
import { MemberInput } from './MemberInput'
import { MemberCard } from './MemberCard'
import { Member } from '../../stores/models'
import { Input } from '@nextui-org/input'
import { useDebounce } from 'use-debounce'
import { MAX_MEMBER_COUNT } from '../../constants'
import { ScrollShadow } from '@nextui-org/scroll-shadow'
import { Tooltip } from '@nextui-org/tooltip'

export const Members = () => {
  const [isAdding, setIsAdding] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  const [keyword, setKeyword] = useState('')
  const [debouncedKeyword] = useDebounce(keyword, 500)

  const [members, setMembers] = useAtom(membersAtom)
  const filteredMembers = members.filter((member) => member.name.toLowerCase().includes(debouncedKeyword.toLowerCase()))

  const addMember = (newMember: Member) => {
    setMembers((members) => [newMember, ...(members as Member[])])
    setIsAdding(false)
  }

  const resetSearch = () => {
    setIsSearching(false)
    setKeyword('')
  }

  return (
    <div className="flex-grow">
      <div className="flex flex-wrap justify-between items-center mb-2">
        <p className="font-bold">
          Anggota ({members.length}/{MAX_MEMBER_COUNT})
        </p>
        <div className="flex gap-1">
          {!!members.length && !isSearching && (
            <Tooltip content="Cari anggota">
              <Button isIconOnly variant="flat" isDisabled={isAdding} onClick={() => setIsSearching(true)} radius="sm">
                <MagnifyingGlassIcon className="w-5 h-5" />
              </Button>
            </Tooltip>
          )}

          <Tooltip content="Tambah anggota">
            <Button
              isIconOnly
              variant="flat"
              isDisabled={isAdding || isSearching || members.length >= MAX_MEMBER_COUNT}
              onClick={() => setIsAdding(true)}
              radius="sm"
            >
              <PlusIcon className="w-5 h-5" />
            </Button>
          </Tooltip>
        </div>
      </div>

      <div className="flex flex-col gap-2 mb-2">
        {isSearching && (
          <>
            <div className="flex items-center gap-1">
              <Input
                radius="sm"
                variant="bordered"
                className="my-2"
                placeholder="Cari anggota"
                value={keyword}
                onValueChange={setKeyword}
                autoFocus
                endContent={<MagnifyingGlassIcon className="w-5 h-5" />}
                onKeyDown={(event) => {
                  if (event.key === 'Escape') resetSearch()
                }}
              />
              <Button isIconOnly variant="flat" onClick={resetSearch} radius="sm">
                <XMarkIcon className="w-5 h-5" />
              </Button>
            </div>
            {!filteredMembers.length && (
              <p className="text-center opacity-80 dark:opacity-60">Cari anggota pake keyword lain!</p>
            )}
          </>
        )}
        {!members.length && !isAdding && <p className="text-center opacity-80 dark:opacity-60">Belum ada anggota</p>}
        {isAdding && <MemberInput onSubmit={addMember} onCancel={() => setIsAdding(false)} />}
        <ScrollShadow className="max-h-64 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-neutral-800 scrollbar-thumb-rounded-full scrollbar-track-transparent">
          <div className="flex flex-col gap-2">
            {filteredMembers.map((member) => (
              <MemberCard key={member.id} member={member} />
            ))}
          </div>
        </ScrollShadow>
      </div>
    </div>
  )
}

import { Select, SelectItem } from '@nextui-org/select'
import { useAtomValue } from 'jotai'
import { membersAtom } from '../../stores'
import { Input } from '@nextui-org/input'

export interface Filter {
  giver: string[]
  receiver: string[]
  amount: number
}

interface Props {
  onFilterChange: (key: keyof Filter, value: any) => void
}

export const BailoutFilter = ({ onFilterChange }: Props) => {
  const members = useAtomValue(membersAtom)

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 my-4">
      <Select
        items={members}
        label="Yang Nalangin"
        placeholder="Yang Nalangin"
        radius="sm"
        size="sm"
        variant="bordered"
        selectionMode="multiple"
        onSelectionChange={(keys) => onFilterChange('giver', [...keys] as string[])}
      >
        {(member) => <SelectItem key={member.id}>{member.name}</SelectItem>}
      </Select>
      <Select
        items={members}
        label="Yang Ditalangin"
        placeholder="Yang Ditalangin"
        radius="sm"
        size="sm"
        variant="bordered"
        selectionMode="multiple"
        onSelectionChange={(keys) => onFilterChange('receiver', [...keys] as string[])}
      >
        {(member) => <SelectItem key={member.id}>{member.name}</SelectItem>}
      </Select>
      <Input
        label="Nominal"
        type="number"
        placeholder="Nominal"
        radius="sm"
        size="sm"
        variant="bordered"
        onValueChange={(value) => onFilterChange('amount', +value)}
      />
    </div>
  )
}

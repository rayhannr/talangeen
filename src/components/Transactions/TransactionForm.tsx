import { Key } from 'react'
import { Select, SelectItem } from '@nextui-org/select'
import { useAtomValue } from 'jotai'
import { membersAtom } from '../../stores'
import { Autocomplete, AutocompleteItem } from '@nextui-org/autocomplete'
import { Transaction } from '../../stores/models'
import { useSimpleReducer } from '../../hooks/reducer'
import { ModalBody, ModalFooter } from '@nextui-org/modal'
import { Button } from '@nextui-org/button'

type FormInput = Omit<Transaction, 'id' | 'createdAt'>
type Touched = {
  [key in keyof FormInput]: boolean
}

interface Props {
  onClose: () => void
}

export const TransactionForm = ({ onClose }: Props) => {
  const members = useAtomValue(membersAtom)
  const [form, setForm] = useSimpleReducer<FormInput>({
    giver: '',
    receivers: [],
    note: '',
    description: '',
    amount: 0,
    type: 'one-for-one',
  })
  const [touched, setTouched] = useSimpleReducer<Touched>({
    giver: false,
    receivers: false,
    note: false,
    description: false,
    amount: false,
    type: false,
  })

  const isGiverValid = !!form.giver?.trim() || !touched.giver
  const isReceiversValid = !!form.receivers?.length || !touched.receivers

  const onGiverChange = (value: Key | null) => {
    const giver = value as string
    const receivers = form.receivers.filter((receiver) => receiver !== giver)
    setForm({ giver, receivers })
  }

  const onReceiversChange = (values: 'all' | Set<Key>) => {
    const receivers = [...values] as string[]
    setForm({ receivers })
  }

  return (
    <>
      <ModalBody>
        <div className="flex flex-col gap-6">
          <Autocomplete
            label="Yang Nalangin"
            variant="bordered"
            radius="sm"
            defaultItems={members}
            selectedKey={form.giver}
            labelPlacement="outside"
            placeholder="e.g. Justin"
            onSelectionChange={onGiverChange}
            isRequired
            isInvalid={!isGiverValid}
            errorMessage={!isGiverValid && 'Harus ada yang nalangin'}
            onClose={() => setTouched({ giver: true })}
          >
            {(member) => (
              <AutocompleteItem key={member.id} value={member.id}>
                {member.name}
              </AutocompleteItem>
            )}
          </Autocomplete>

          <Select
            items={members}
            selectionMode="multiple"
            label="Yang Ditalangin"
            labelPlacement="outside"
            radius="sm"
            placeholder="e.g. Lhaksana, Alex"
            variant="bordered"
            selectedKeys={form.receivers}
            disabledKeys={[form.giver]}
            onSelectionChange={onReceiversChange}
            isRequired
            isInvalid={!isReceiversValid}
            errorMessage={!isReceiversValid && 'Harus ada yang ditalangin'}
            onClose={() => setTouched({ receivers: true })}
          >
            {(member) => (
              <SelectItem key={member.id} value={member.id}>
                {member.name}
              </SelectItem>
            )}
          </Select>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="danger" radius="sm" variant="light" onPress={onClose}>
          Batal
        </Button>
        <Button variant="flat" radius="sm" onPress={onClose} isDisabled={!isGiverValid || !isReceiversValid}>
          Tambah
        </Button>
      </ModalFooter>
    </>
  )
}

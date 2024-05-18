import { Key } from 'react'
import { Select, SelectItem } from '@nextui-org/select'
import { useAtomValue } from 'jotai'
import { membersAtom } from '../../stores'
import { Autocomplete, AutocompleteItem } from '@nextui-org/autocomplete'
import { Transaction, TransactionType } from '../../stores/models'
import { useSimpleReducer } from '../../hooks/reducer'
import { ModalBody, ModalFooter } from '@nextui-org/modal'
import { Button } from '@nextui-org/button'
import { Radio, RadioGroup } from '@nextui-org/radio'
import { Input, Textarea } from '@nextui-org/input'

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
  const isAmountValid = /^(0|[1-9]\d*)(\.\d+)?$/.test(String(form.amount)) || form.amount > 0 || !touched.amount
  const isNoteValid = !!form.note?.trim() || !touched.note

  const onGiverChange = (value: Key | null) => {
    const giver = value as string
    const receivers = form.receivers.filter((receiver) => receiver !== giver)
    setForm({ giver, receivers })
  }

  const onReceiversChange = (values: 'all' | Set<Key>) => {
    const receivers = [...values] as string[]
    setForm({ receivers })
  }

  const onTypeChange = (type: string) => {
    setForm({ type: type as TransactionType })
  }

  const onAmountChange = (value: string) => {
    setTouched({ amount: true })
    const amount = +value
    setForm({ amount })
  }

  const onNoteChange = (note: string) => {
    setTouched({ note: true })
    setForm({ note })
  }

  const getAmountDescription = (type: TransactionType) => {
    const receiversTotal = form.receivers.length
    if (receiversTotal <= 1) return ''

    const amountPerReceiver = (
      type === 'one-for-one' ? form.amount : +(form.amount / receiversTotal).toFixed(3)
    ).toLocaleString()

    if (type === 'one-for-one') return `Yang ditalangin masing-masing dapet ${amountPerReceiver}`
    return `Yang ditalangin masing-masing dapet ${form.amount.toLocaleString()} / ${receiversTotal} = ${amountPerReceiver}`
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
            classNames={{ value: !!form.receivers.length && 'text-foreground' }}
          >
            {(member) => (
              <SelectItem key={member.id} value={member.id}>
                {member.name}
              </SelectItem>
            )}
          </Select>

          <Input
            type="number"
            label="Nominal"
            placeholder="e.g. 14000"
            radius="sm"
            labelPlacement="outside"
            variant="bordered"
            value={String(form.amount)}
            isRequired
            isInvalid={!isAmountValid}
            errorMessage={!isAmountValid && 'Nominal harus berupa angka yang lebih besar dari 0'}
            onValueChange={onAmountChange}
          />

          {form.receivers.length > 1 && (
            <RadioGroup
              label="Tipe Talangan"
              orientation="horizontal"
              isRequired
              classNames={{ label: 'text-foreground text-sm' }}
              value={form.type}
              onValueChange={onTypeChange}
            >
              <Radio
                value="one-for-one"
                classNames={{ label: 'text-sm mr-6' }}
                description={getAmountDescription('one-for-one')}
              >
                Satu untuk satu
              </Radio>
              <Radio value="one-for-all" classNames={{ label: 'text-sm' }} description={getAmountDescription('one-for-all')}>
                Satu untuk semua
              </Radio>
            </RadioGroup>
          )}
          <Input
            label="Tujuan"
            placeholder="e.g. Tiket masuk Obelix Sea View"
            radius="sm"
            labelPlacement="outside"
            variant="bordered"
            value={form.note}
            isRequired
            isInvalid={!isNoteValid}
            errorMessage={!isNoteValid && 'Tujuan harus diisi biar jelas duit talangan buat apaan'}
            onValueChange={onNoteChange}
          />

          <Textarea
            label="Deskripsi"
            placeholder="e.g. Mahal tapi pemandangannya bagus heheh"
            radius="sm"
            variant="bordered"
            labelPlacement="outside"
            value={form.description}
            onValueChange={(description) => setForm({ description })}
          />
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
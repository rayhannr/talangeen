import { Key } from 'react'
import { Select, SelectItem } from '@nextui-org/select'
import { useAtomValue, useSetAtom } from 'jotai'
import { membersAtom, membersMapAtom, transactionsAtom } from '../../stores'
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
  transaction?: Transaction
}

const DEFAULT_FORM: FormInput = {
  giver: '',
  receivers: [],
  note: '',
  description: '',
  amount: 0,
  type: 'one-for-one',
}

export const TransactionForm = ({ onClose, transaction }: Props) => {
  const members = useAtomValue(membersAtom)
  const membersMap = useAtomValue(membersMapAtom)
  const setTransactions = useSetAtom(transactionsAtom)

  const [form, setForm] = useSimpleReducer<FormInput>({
    ...DEFAULT_FORM,
    ...transaction,
    giver: membersMap.has(transaction?.giver || '') ? transaction?.giver! : '',
    receivers: transaction?.receivers?.filter((receiver) => membersMap.has(receiver)) || [],
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
  const isAmountValid = (/^(0|[1-9]\d*)(\.\d+)?$/.test(String(form.amount)) && form.amount > 0) || !touched.amount
  const isNoteValid = !!form.note?.trim() || !touched.note

  const isAllValid = () =>
    !!form.giver?.trim() &&
    !!form.receivers?.length &&
    /^(0|[1-9]\d*)(\.\d+)?$/.test(String(form.amount)) &&
    form.amount > 0 &&
    !!form.note?.trim()

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

    const formattedAmount = form.amount.toLocaleString()
    const amountPerReceiver = (
      type === 'one-for-one' ? form.amount : +(form.amount / receiversTotal).toFixed(3)
    ).toLocaleString()

    if (type === 'one-for-one')
      return `Yang ditalangin masing-masing dapet ${formattedAmount}, jadi totalnya ${(
        form.amount * receiversTotal
      ).toLocaleString()}`
    return `Yang ditalangin masing-masing dapet ${formattedAmount} / ${receiversTotal} = ${amountPerReceiver}`
  }

  const onSubmit = () => {
    setTouched({ giver: true, receivers: true, note: true, amount: true, type: true })
    if (!isAllValid()) return

    const type = form.receivers.length <= 1 ? 'one-for-one' : form.type

    if (!transaction) {
      setTransactions((transactions) => [
        {
          ...form,
          type,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        },
        ...(transactions as Transaction[]),
      ])
    } else {
      setTransactions((transactions) => {
        const clonedTransactions = structuredClone(transactions as Transaction[])
        const editedIndex = clonedTransactions.findIndex((t) => t.id === transaction.id)
        clonedTransactions[editedIndex] = {
          ...clonedTransactions[editedIndex],
          ...form,
          type,
        }

        return clonedTransactions
      })
    }
    onClose()
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
            maxLength={100}
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
            maxLength={256}
          />
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="danger" radius="sm" variant="light" onPress={onClose}>
          Batal
        </Button>
        <Button variant="flat" radius="sm" onPress={onSubmit} isDisabled={!isGiverValid || !isReceiversValid}>
          Tambah
        </Button>
      </ModalFooter>
    </>
  )
}

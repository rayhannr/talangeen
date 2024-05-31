import { Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/modal'
import { PrismLight } from 'react-syntax-highlighter'
import { duotoneSpace } from 'react-syntax-highlighter/dist/esm/styles/prism'
import json from 'react-syntax-highlighter/dist/cjs/languages/prism/json'
import js from 'react-syntax-highlighter/dist/cjs/languages/prism/javascript'
import { z } from 'zod'
import { Tab, Tabs } from '@nextui-org/tabs'
import { Code } from '@nextui-org/code'

PrismLight.registerLanguage('javascript', js)
PrismLight.registerLanguage('json', json)

interface Props {
  isOpen: boolean
  onClose: () => void
  zodErrors?: z.ZodIssue[]
}

const SyntaxHighlighter = ({ content, language = 'json' }: { content: any; language?: string }) => (
  <PrismLight language={language} style={duotoneSpace} wrapLongLines customStyle={{ borderRadius: 8, maxHeight: 400 }}>
    {content}
  </PrismLight>
)

const CORRECT_FORMAT = `{
  members: [
    {
      name: "Erling Haaland", // teks
      id: "de0e21e3" // teks
    },
    ...
  ],
  transactions: [
    {
      giver: "7eacc77f", // teks
      receivers: ["de0e21e3", "3a383784"], // teks[]
      note: "Mie Ayam Afui", // teks
      description: "porsi jumbo", // teks 
      amount: 20000, // angka
      type: "one-for-one", // teks 'one-for-one' atau 'one-for-all' 
      "id": "c11ecaef", // teks
      "createdAt": "2024-05-27T14:46:39.438Z" // teks tanggal-waktu valid dalam Javascript
    },
    ...
  ]
}
`

const ERROR_EXAMPLE = `[
  {
    "code": "invalid_type",
    "expected": "string",
    "received": "number",
    "path": [
      "members",
      5,
      "id"
    ],
    "message": "Expected string, received number"
  }
]
`

export const ImportFailedModal = ({ isOpen, onClose, zodErrors }: Props) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" radius="sm" placement="top">
      <ModalContent>
        <ModalHeader>Gagal Impor</ModalHeader>
        <ModalBody>
          <Tabs aria-label="content tabs">
            <Tab key="warning" title="Peringatan">
              <p>Impor datanya gagal bre. Bisa jadi karena:</p>
              <ul className="list-inside list-disc ml-3">
                <li>lu upload file selain .json</li>
                <li>lu upload .json, tapi format datanya salah</li>
              </ul>
              {!!zodErrors?.length && (
                <>
                  <p className="my-4">Eror di bawah ini nunjukkin mana yang salah dari data yang lu impor</p>
                  <SyntaxHighlighter content={JSON.stringify(zodErrors, null, 2)} />
                </>
              )}
            </Tab>
            {!!zodErrors?.length && (
              <Tab key="how-to" title="Cara baca eror">
                Misal di <i>tab</i> <Code className="mx-px">Peringatan</Code> lu nemu eror kek gini
                <SyntaxHighlighter content={ERROR_EXAMPLE} language="json" />
                Maksudnya, <Code className="mx-px">id</Code> di data ke-6 dari <Code className="mx-px">members</Code> formatnya
                salah. Harusnya <Code className="mx-px">string</Code> atau teks, tapi lu malah masukkin angka.
                <p className="mt-4">
                  Note: indeks di Javascript dimulai dari 0. Jadi, data dengan indeks 5 berarti dia data ke-6
                </p>
              </Tab>
            )}
            <Tab key="correct-format" title="Format yang bener">
              Berikut contoh data yang formatnya bener
              <SyntaxHighlighter content={CORRECT_FORMAT} language="javascript" />
            </Tab>
          </Tabs>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

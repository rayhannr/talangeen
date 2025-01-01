import { Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/modal'

interface Props {
  isOpen: boolean
  onOpenChange: () => void
}

export const InfoModalV2 = ({ isOpen, onOpenChange }: Props) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Versi 2</ModalHeader>
        <ModalBody>
          <p>Misal ada anggota A, B, C, sama D. Mereka saling menalangi dengan rincian kek gini</p>
          <ul className="list-disc list-inside">
            <li>A nalangin C 5000</li>
            <li>B nalangin A 2000</li>
            <li>B nalangin A sama D masing-masing 7500</li>
            <li>C nalangin B 3000</li>
            <li>C nalangin A 4000</li>
          </ul>
          <p>Kita akumulasiin duit talangan per orang, ketemu hasilnya kek di bawah ini</p>
          <ul className="list-disc list-inside">
            <li>A -8500</li>
            <li>B +14000</li>
            <li>C +2000</li>
            <li>D -7500</li>
          </ul>
          <p>Yang perlu diperhatiin:</p>
          <ul className="list-disc list-inside">
            <li>Total duit yang (+) dan (-) pasti sama, 16000</li>
            <li>Yang akumulasinya negatif cukup balikin duit aja meskipun dia pernah nalangin</li>
            <li>Yang akumulasinya positif cukup terima duit aja meskipun dia pernah ditalangin</li>
          </ul>
          <p>Dari keterangan di atas, hasil akhirnya kira-kira gini</p>
          <ul className="list-disc list-inside">
            <li>A balikin duit ke B 8500</li>
            <li>D balikin duit ke B 5500</li>
            <li>D balikin duit ke C 2000</li>
          </ul>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

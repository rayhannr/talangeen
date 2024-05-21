import { Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/modal'

interface Props {
  isOpen: boolean
  onOpenChange: () => void
}

export const InfoModalV2 = ({ isOpen, onOpenChange }: Props) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Versi 1</ModalHeader>
        <ModalBody>
          <p>Misal ada anggota A, B, C, sama D. Mereka saling menalangi dengan rincian kek gini</p>
          <ul className="list-disc list-inside">
            <li>A nalangin C 5000</li>
            <li>B nalangin A 2000</li>
            <li>B nalangin A sama D masing-masing 7500</li>
            <li>C nalangin B 3000</li>
          </ul>
          <p>Kita akumulasiin duit talangan per orang, ketemu hasilnya kek di bawah ini</p>
          <ul className="list-disc list-inside">
            <li>A -4500</li>
            <li>B +14000</li>
            <li>C -2000</li>
            <li>D -7500</li>
          </ul>
          <p>
            Total duit yang (+) dan (-) pasti sama. Gak penting siapa nalangin siapa. Yang penting di sini adalah, orang yang
            akumulasinya (-) balikin duit orang yang akumulasinya (+)
          </p>
          <p>
            Dari keterangan di atas, setelah lu klik tombol berikon kalkulator, bakal muncul tabel di bawah yang nampilin duit
            talangan yang harus dibalikin dari siapa ke siapa. Kira-kira rinciannya gini
          </p>
          <ul className="list-disc list-inside">
            <li>A balikin duit ke B 4500</li>
            <li>C balikin duit ke B 2000</li>
            <li>D balikin duit ke B 7500</li>
          </ul>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

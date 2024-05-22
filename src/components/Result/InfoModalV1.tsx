import { Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/modal'

interface Props {
  isOpen: boolean
  onOpenChange: () => void
}

export const InfoModalV1 = ({ isOpen, onOpenChange }: Props) => {
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
            <li>C nalangin A 4000</li>
          </ul>
          <p>
            Setelah lu klik tombol berikon kalkulator, bakal muncul tabel di bawah yang nampilin duit talangan yang harus
            dibalikin dari siapa ke siapa. Kira-kira rinciannya gini
          </p>
          <ul className="list-disc list-inside">
            <li>A balikin duit B 9500</li>
            <li>B balikin duit C 3000</li>
            <li>C balikin duit A 1000</li>
            <li>D balikin duit B 7500</li>
          </ul>
          <p>
            B nalangin A 2 kali, 7500 sama 2000, tapi bukan berarti A balikinnya 2 kali juga. A cukup balikin duit ke B sekali
            sebesar 9500
          </p>
          <p>
            A nalangin C 5000, habis itu C nalangin A 4000. Ntar A gak perlu balikin duit C 4000 dan C balikin duit A 5000
            karena itu intinya sama aja kek C balikin duit A 1000
          </p>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

import { Button } from '@nextui-org/button'
import { Code } from '@nextui-org/code'
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/modal'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSubmit: () => void
}

export const ImportWarningModal = ({ isOpen, onClose, onSubmit }: Props) => {
  const submit = () => {
    onSubmit()
    onClose()
  }
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>Peringatan</ModalHeader>
        <ModalBody>
          <p>
            Setelah impor data, data yang lama bakal ilang semua. Pastikan lu udah tau konsekuensinya sebelum lu klik tombol{' '}
            <Code className="mx-px inline">Gaskeun</Code>
          </p>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" radius="sm" variant="light" onPress={onClose}>
            Batal
          </Button>
          <Button radius="sm" variant="flat" onPress={submit}>
            Gaskeun
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

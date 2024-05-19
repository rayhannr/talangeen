import { membersMapAtom, store } from '../stores'

export const getMemberName = (memberId: string, map?: Map<string, string>) => {
  const membersMap = map || store.get(membersMapAtom)
  return membersMap.get(memberId) || <i>anggota terhapus</i>
}

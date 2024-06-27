import { membersMapAtom, store } from '../stores'

export const getMemberName = (memberId: string, map?: Map<string, string>, textOnly?: boolean) => {
  const membersMap = map || store.get(membersMapAtom)
  const placeholder = textOnly ? 'anggota terhapus' : <i>anggota terhapus</i>
  return membersMap.get(memberId) || placeholder
}

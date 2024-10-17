import { Selection } from '@tiptap/pm/state'

export type EditorTab = {
  id: string
  title: string
  content: string
  selection?: Selection | null
}

export type SidebarFile = {
  title: string
  filePath: string
}

import { Selection } from '@tiptap/pm/state'

export type EditorDocument = {
  id: string
  name: string
  content: string
  filePath?: string
  selection?: Selection
}

export type EditorTab = {
  title: string
  content: string
  selection?: Selection | null
}

export type SidebarFile = {
  title: string
  filePath: string
}

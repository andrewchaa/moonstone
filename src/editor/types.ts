import { Selection } from '@tiptap/pm/state'

export type File = {
  id: string
  name: string
  content: string
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

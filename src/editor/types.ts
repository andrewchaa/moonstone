import { Selection } from "@milkdown/prose/state"

export type EditorDocument = {
  id: string
  name: string
  content: string
  cursorPos?: number
  filePath?: string
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

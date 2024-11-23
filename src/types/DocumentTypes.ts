import { Selection } from "@milkdown/prose/state"

export type EditorDocument = {
  id: string
  name: string
  content: string
  cursorPos?: number
  filePath: string
}

export type VaultFile = {
  name: string
  filePath: string
  lastModified: string
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

export type DocumentHeading = {
  depth: number
  title: string
  pos: number
}

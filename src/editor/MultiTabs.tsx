import { KeyboardEvent, useRef, useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CrepeEditor from "@/editor/Crepe"
import { EditorDocument } from "@/types/DocumentTypes"
import { Edit2, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { getDisplayName } from "../helper-functions/renderFunctions"

type Props = {
  activeFile: string
  setActiveFile: (id: string) => void
  openDocuments: EditorDocument[]
  setOpenDocuments: (documents: EditorDocument[]) => void
  closeFile: (id: string) => void
  handleContentChange: (
    id: string,
    newContent: string,
    cursorPos?: number
  ) => void
}

export default function MultiTabs({
  activeFile,
  setActiveFile,
  openDocuments,
  setOpenDocuments,
  closeFile,
  handleContentChange
}: Props) {
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const titleInputRef = useRef<HTMLInputElement>(null)

  const activeFileName = openDocuments.find(file => file.id === activeFile)?.name || ''

  const startEditingTitle = () => {
    setIsEditingTitle(true)
    setTimeout(() => titleInputRef.current?.focus(), 0)
  }

  const handleTitleChange = async (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const newTitle = event.currentTarget.value
      const activeDocument = openDocuments.find(doc => doc.id === activeFile)
      if (!activeDocument) return

      setOpenDocuments(openDocuments.filter(doc => doc.id !== activeDocument.id))
      setOpenDocuments([...openDocuments, { ...activeDocument, id: newTitle, name: newTitle }])
      setIsEditingTitle(false)
      await window.electronAPI.writeFile(newTitle, activeDocument.content)
    }
  }

  return (
    <Tabs value={activeFile} onValueChange={setActiveFile} className="flex-1 flex flex-col overflow-hidden">
      <ScrollArea className="w-full border-b">
      <SidebarTrigger />
        <TabsList>
          {openDocuments.map((file) => (
            <TabsTrigger key={file.id} value={file.id} className="flex items-center">
              {file.name}
              <div
                className="ml-2 h-4 w-4 p-0"
                onClick={(e) => {
                  e.stopPropagation()
                  closeFile(file.id)
                }}
              >
                <X className="h-3 w-3" />
              </div>
            </TabsTrigger>
          ))}
        </TabsList>
      </ScrollArea>
      {openDocuments.map((document) => (
        <TabsContent key={document.id} value={document.id} className="flex-1 p-4 overflow-auto">
          <div className="ml-28 flex items-center">
            {isEditingTitle ? (
              <Input
                ref={titleInputRef}
                defaultValue={activeFileName}
                onKeyDown={handleTitleChange}
                onBlur={() => setIsEditingTitle(false)}
                className="text-2xl font-bold"
              />
            ) : (
              <h2 className="text-2xl font-bold mr-2">{getDisplayName(activeFileName)}</h2>
            )}
            <Button variant="ghost" size="sm" onClick={startEditingTitle}>
              <Edit2 className="h-4 w-4" />
            </Button>
          </div>

          <CrepeEditor
            content={document.content}
            cursorPos={document.cursorPos}
            onChange={(markdown, selection) => handleContentChange(
              document.id,
              markdown,
              selection
            )}
          />
        </TabsContent>
      ))}
    </Tabs>
  )
}

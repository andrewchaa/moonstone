import { KeyboardEvent, useRef, useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CrepeEditor from "@/editor/Crepe"
import { Edit2, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { getDisplayName } from "../helper-functions/renderFunctions"
import { useMoonstoneEditorContext } from "@/context/MoonstoneEditorContext"

type Props = {
  activeDocument: string
  setActiveDocument: (id: string) => void
  closeFile: (id: string) => void
  handleContentChange: (
    id: string,
    newContent: string,
    cursorPos?: number
  ) => void
}

export default function   MultiTabs({
  activeDocument,
  setActiveDocument,
  closeFile,
  handleContentChange
}: Props) {
  const { openDocuments, setOpenDocuments } = useMoonstoneEditorContext()
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const titleInputRef = useRef<HTMLInputElement>(null)

  const activeDocumentName = openDocuments.find(file => file.id === activeDocument)?.name || ''

  const startEditingTitle = () => {
    setIsEditingTitle(true)
    setTimeout(() => titleInputRef.current?.focus(), 0)
  }

  const handleTitleChange = async (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const newTitle = event.currentTarget.value
      const currentDocument = openDocuments.find(doc => doc.id === activeDocument)
      if (!currentDocument) return

      setOpenDocuments(openDocuments.filter(doc => doc.id !== currentDocument.id))
      setOpenDocuments([...openDocuments, { ...currentDocument, id: newTitle, name: newTitle }])
      setIsEditingTitle(false)
      await window.electronAPI.writeFile(newTitle, currentDocument.content)
      await window.electronAPI.deleteFile(currentDocument.id)
    }
  }

  return (
    <Tabs value={activeDocument} onValueChange={setActiveDocument} className="flex-1 flex flex-col overflow-hidden">
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
                defaultValue={activeDocumentName}
                onKeyDown={handleTitleChange}
                onBlur={() => setIsEditingTitle(false)}
                className="text-2xl font-bold"
              />
            ) : (
              <h1 className="text-3xl mr-2">{getDisplayName(activeDocumentName)}</h1>
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

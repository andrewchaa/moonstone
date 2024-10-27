import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CrepeEditor from "@/editor/Crepe"
import { EditorDocument } from "@/types/DocumentTypes"
import { X } from "lucide-react"

type Props = {
  activeFile: string
  setActiveFile: (id: string) => void
  openDocuments: EditorDocument[]
  closeFile: (id: string) => void
  handleContentChange: (
    id: string,
    filePath: string,
    newContent: string,
    cursorPos?: number
  ) => void
}

export default function MultiTabs({
  activeFile,
  setActiveFile,
  openDocuments,
  closeFile,
  handleContentChange
}: Props) {
  return (
    <Tabs value={activeFile} onValueChange={setActiveFile} className="flex-1 flex flex-col overflow-hidden">
    <ScrollArea className="w-full border-b" orientation="horizontal">
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
        <CrepeEditor
          content={document.content}
          cursorPos={document.cursorPos}
          onChange={(markdown, selection) => handleContentChange(
            document.id,
            document.filePath,
            markdown,
            selection
          )}
        />
      </TabsContent>
    ))}
  </Tabs>
  )
}

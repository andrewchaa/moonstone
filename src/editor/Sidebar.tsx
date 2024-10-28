import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Vault } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { EditorDocument } from "@/types/DocumentTypes"

type Props = {
  isSidebarVisible: boolean
  toggleSidebar: () => void
  openDocuments: EditorDocument[]
  setOpenDocuments: (documents: EditorDocument[]) => void
  setActiveFile: (id: string) => void
  vaultDocuments: EditorDocument[]
}

const Sidebar = ({
  isSidebarVisible,
  toggleSidebar,
  openDocuments,
  setOpenDocuments,
  setActiveFile,
  vaultDocuments,
}: Props) => {
  return (
    <div className={`${isSidebarVisible ? 'w-64' : 'w-10'} transition-all duration-300 ease-in-out overflow-hidden border-r flex flex-col`}>
    <div className="p-2 flex justify-end border-b">
      <Button variant="ghost" size="icon" onClick={toggleSidebar} aria-label={isSidebarVisible ? "Hide sidebar" : "Show sidebar"}>
        {isSidebarVisible ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </Button>
    </div>
    {isSidebarVisible && (
      <>
        <ScrollArea className="flex-1">
          <div className="p-4">
            <h2 className="mb-4 text-lg font-semibold">Open Files</h2>
            <ul>
              {openDocuments.map((file) => (
                <li key={file.id} className="mb-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => setActiveFile(file.id)}
                  >
                    {file.name}
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </ScrollArea>
        <ScrollArea className="flex-1">
          <div className="p-4">
            <h2 className="mb-4 text-lg font-semibold">Vault Files</h2>
            <ul>
              {vaultDocuments.map((file) => (
                <li key={file.id} className="mb-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      if (!openDocuments.some(doc => doc.id === file.id)) {
                        setOpenDocuments([...openDocuments, file])
                        setActiveFile(file.id)
                      }
                    }}
                  >
                    {file.name}
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </ScrollArea>
      </>
    )}
  </div>
  )
}

export default Sidebar

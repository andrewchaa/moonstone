import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { EditorTab, SidebarFile } from "@/editor/types"
import { PlusCircle, FileText, Folder } from 'lucide-react'

type Props = {
  isSidebarOpen: boolean
  activeTab: string | null
  setActiveTab: (tabId: string) => void
  addTab: (title?: string) => void
  sidebarFiles: SidebarFile[]
  setSidebarFiles: (files: SidebarFile[]) => void
}

const EditorSidebar = ({
  isSidebarOpen,
  activeTab,
  setActiveTab,
  addTab,
  sidebarFiles,
  setSidebarFiles
}: Props) => {

  return (
    <div className={`transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-64 mr-4' : 'w-0 mr-0'}`}>
    {isSidebarOpen && (
      <div className="border rounded-lg p-4 h-full flex flex-col">
        <h2 className="text-lg font-semibold mb-4">Files</h2>
        <ScrollArea className="flex-grow mb-4">
          {sidebarFiles.map(file => (
            <Button
              key={file.title}
              variant={activeTab === file.title ? "secondary" : "ghost"}
              className="w-full justify-start mb-2"
              onClick={() => setActiveTab(file.title)}
            >
              <FileText className="h-4 w-4 mr-2" />
              {file.title}
            </Button>
          ))}
        </ScrollArea>
        <Button onClick={() => addTab()} className="w-full justify-start">
          <PlusCircle className="h-4 w-4 mr-2" /> New File
        </Button>
        <Button
          onClick={async () => {
            const [directoryPath, files] = await window.electronAPI.openDirectorySelector()
            const sidebarFiles = files
              .filter((file: string) => !file.startsWith('.'))
              .map((file: string) => ({
                title: file,
                filePath: `${directoryPath}/${file}`
              }))
            setSidebarFiles(sidebarFiles)
            setActiveTab(sidebarFiles[0].title)
          }}
          className="w-full justify-start"
        >
          <Folder className="h-4 w-4 mr-2" /> Open Vault
        </Button>
      </div>
    )}
  </div>
  )
}

export default EditorSidebar

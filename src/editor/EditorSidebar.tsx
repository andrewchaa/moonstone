import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PlusCircle, FileText, Folder } from 'lucide-react'
import { EditorTab } from '@/editor/MultiTabTextEditor'
import { useState } from "react"

type Props = {
  isSidebarOpen: boolean
  tabs: EditorTab[]
  activeTab: string | null
  setActiveTab: (tabId: string) => void
  addTab: () => void
}

const EditorSidebar = ({
  isSidebarOpen,
  tabs,
  activeTab,
  setActiveTab,
  addTab,
}: Props) => {
  const [filenames, setFilenames] = useState<string[]>([])

  return (
    <div className={`transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-64 mr-4' : 'w-0 mr-0'}`}>
    {isSidebarOpen && (
      <div className="border rounded-lg p-4 h-full flex flex-col">
        <h2 className="text-lg font-semibold mb-4">Files</h2>
        <ScrollArea className="flex-grow mb-4">
          {tabs.map(tab => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "secondary" : "ghost"}
              className="w-full justify-start mb-2"
              onClick={() => setActiveTab(tab.id)}
            >
              <FileText className="h-4 w-4 mr-2" />
              {tab.title}
            </Button>
          ))}
        </ScrollArea>
        <Button onClick={addTab} className="w-full justify-start">
          <PlusCircle className="h-4 w-4 mr-2" /> New File
        </Button>
        <Button
          onClick={async () => {
            const [directoryPath, files] = await window.electronAPI.openDirectorySelector()
            console.log('files', directoryPath, files)
            setFilenames(files)
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

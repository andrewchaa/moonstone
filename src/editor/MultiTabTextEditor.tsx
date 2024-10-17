import { useEffect, useState } from 'react'
import { marked } from 'marked'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { X, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { Selection } from '@tiptap/pm/state'
import Tiptap from '@/editor/Tiptap'
import EditorSidebar from '@/editor/EditorSidebar'
import { EditorTab, SidebarFile } from '@/editor/types'

export default function MultiTabTextEditor() {
  const [tabs, setTabs] = useState<EditorTab[]>([])
  const [sidebarFiles, setSidebarFiles] = useState<SidebarFile[]>([])
  const [activeTabTitle, setActiveTabTitle] = useState<string | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const addTab = (title: string, content: string) => {
    const newTab: EditorTab = {
      title,
      content,
    }
    setTabs([...tabs, newTab])
    setActiveTabTitle(newTab.title)
  }

  const removeTab = (tabId: string) => {
    const newTabs = tabs.filter(tab => tab.id !== tabId)
    setTabs(newTabs)
    if (activeTabTitle === tabId && newTabs.length > 0) {
      setActiveTabTitle(newTabs[newTabs.length - 1].id)
    } else if (newTabs.length === 0) {
      setActiveTabTitle(null)
    }
  }

  const updateTabContent = (
    title: string,
    content: string,
    selection?: Selection | null
  ) => {
    const tabExist = tabs.find(tab => tab.title === title)
    if (tabExist) {
      setTabs(tabs.map(tab =>
        tab.title === title ? { ...tab, content, selection } : tab
      ))
      return
    }

    setTabs([...tabs, { title, content, selection }])
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  useEffect(() => {
    const loadFileContent = async () => {
      if (!activeTabTitle) {
        return
      }

      const activeFile = sidebarFiles.find(file => file.title === activeTabTitle)
      const markdownContent = await window.electronAPI.readFileContent(activeFile.filePath)
      if (!activeFile) {
        return
      }

      updateTabContent(activeTabTitle, await marked(markdownContent))
    }
    loadFileContent()
  }, [activeTabTitle])

  return (
    <div className="w-full max-w-6xl mx-auto p-4 flex">

      <EditorSidebar
        isSidebarOpen={isSidebarOpen}
        activeTabTitle={activeTabTitle}
        setActiveTabTitle={setActiveTabTitle}
        addTab={addTab}
        sidebarFiles={sidebarFiles}
        setSidebarFiles={setSidebarFiles}
      />

      {/* Main content */}
      <div className="flex-grow">
        <div className="mb-4 flex justify-between items-center">
          <Button onClick={toggleSidebar} variant="outline" size="sm">
            {isSidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
            <span className="sr-only">Toggle sidebar</span>
          </Button>
        </div>

        {activeTabTitle ? (
          <Tabs value={activeTabTitle} onValueChange={setActiveTabTitle} className="w-full">
            <TabsList className="mb-4">
              {tabs.map(tab => (
                <TabsTrigger key={tab.id} value={tab.id} className="flex items-center">
                  {tab.title}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-2 p-0"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeTab(tab.id)
                    }}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close tab</span>
                  </Button>
                </TabsTrigger>
              ))}
            </TabsList>
            {tabs.map(tab => (
              <TabsContent key={tab.title} value={tab.title} className="mt-0">
                <Tiptap
                  content={tab.content}
                  selection={tab.selection}
                  handleUpdate={(content, selection) => updateTabContent(
                    tab.id,
                    content,
                    selection
                  )}
                />
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div className="text-center text-gray-500 mt-8">
            No file selected. Create a new file or select one from the sidebar.
          </div>
        )}
      </div>
    </div>
  )
}

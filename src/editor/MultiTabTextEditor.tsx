import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { X, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { Selection } from '@tiptap/pm/state'
import Tiptap from '@/editor/Tiptap'
import EditorSidebar from '@/editor/EditorSidebar'

export interface EditorTab {
  id: string
  title: string
  content: string
  selection?: Selection | null
}

export default function MultiTabTextEditor() {
  const [tabs, setTabs] = useState<EditorTab[]>([])
  const [activeTab, setActiveTab] = useState<string | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const addTab = () => {
    const newTab: EditorTab = {
      id: Date.now().toString(),
      title: `Untitled ${tabs.length + 1}`,
      content: ''
    }
    setTabs([...tabs, newTab])
    setActiveTab(newTab.id)
  }

  const removeTab = (tabId: string) => {
    const newTabs = tabs.filter(tab => tab.id !== tabId)
    setTabs(newTabs)
    if (activeTab === tabId && newTabs.length > 0) {
      setActiveTab(newTabs[newTabs.length - 1].id)
    } else if (newTabs.length === 0) {
      setActiveTab(null)
    }
  }

  const updateTabContent = (
    tabId: string,
    content: string,
    selection?: Selection | null
  ) => {
    setTabs(tabs.map(tab =>
      tab.id === tabId ? { ...tab, content, selection } : tab
    ))
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4 flex">

      <EditorSidebar
        isSidebarOpen={isSidebarOpen}
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        addTab={addTab}
        setTabs={setTabs}
      />

      {/* Main content */}
      <div className="flex-grow">
        <div className="mb-4 flex justify-between items-center">
          <Button onClick={toggleSidebar} variant="outline" size="sm">
            {isSidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
            <span className="sr-only">Toggle sidebar</span>
          </Button>
        </div>

        {activeTab ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
              <TabsContent key={tab.id} value={tab.id} className="mt-0">
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

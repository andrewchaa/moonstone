'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PlusCircle, X, FileText, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { Selection } from '@tiptap/pm/state'
import Tiptap from '@/Tiptap'

interface Tab {
  id: string
  title: string
  content: string
  selection?: Selection | null
}

export default function MultiTabTextEditor() {
  const [tabs, setTabs] = useState<Tab[]>([])
  const [activeTab, setActiveTab] = useState<string | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const addTab = () => {
    const newTab: Tab = {
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
      {/* Sidebar */}
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
              <PlusCircle className="h-4 w-4 mr-2" />
              New File
            </Button>
          </div>
        )}
      </div>

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

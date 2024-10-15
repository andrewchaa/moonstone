'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle, X } from 'lucide-react'

interface Tab {
  id: string
  title: string
  content: string
}

export default function MultiTabEditor() {
  const [tabs, setTabs] = useState<Tab[]>([
    { id: '1', title: 'Tab 1', content: '' }
  ])
  const [activeTab, setActiveTab] = useState('1')

  const addTab = () => {
    const newTab: Tab = {
      id: Date.now().toString(),
      title: `Tab ${tabs.length + 1}`,
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
    }
  }

  const updateTabContent = (tabId: string, newContent: string) => {
    setTabs(tabs.map(tab =>
      tab.id === tabId ? { ...tab, content: newContent } : tab
    ))
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
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
          <Button onClick={addTab} variant="outline" size="sm">
            <PlusCircle className="h-4 w-4 mr-2" />
            New Tab
          </Button>
        </div>
        {tabs.map(tab => (
          <TabsContent key={tab.id} value={tab.id} className="mt-0">
            <Textarea
              value={tab.content}
              onChange={(e) => updateTabContent(tab.id, e.target.value)}
              placeholder="Start typing here..."
              className="min-h-[300px] resize-y"
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

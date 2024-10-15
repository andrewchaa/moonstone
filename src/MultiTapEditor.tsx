'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { PlusCircle, X } from 'lucide-react'
import Tiptap from '@/Tiptap'

interface Tab {
  id: string
  title: string
  content: string
}

const initialContent = `
<h2>
  Hi there,
</h2>
<p>
  this is a <em>basic</em> example of <strong>Tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:
</p>
<ul>
  <li>
    That’s a bullet list with one …
  </li>
  <li>
    … or two list items.
  </li>
</ul>
<p>
  Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:
</p>
<pre><code class="language-css">body {
  display: none;
}</code></pre>
<p>
  I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.
</p>
<blockquote>
  Wow, that’s amazing. Good work, boy! 👏
  <br />
  — Mom
</blockquote>
`


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
            <Tiptap
              content={tab.content}
              handleUpdate={(contentUpdate) => updateTabContent(tab.id, contentUpdate)}
            />
            {/* <Textarea
              value={tab.content}
              onChange={(e) => updateTabContent(tab.id, e.target.value)}
              placeholder="Start typing here..."
              className="min-h-[300px] resize-y"
            />*/}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

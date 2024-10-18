import { useState } from 'react'
import { X, ChevronLeft, ChevronRight, Vault } from 'lucide-react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Selection } from '@tiptap/pm/state'
import Tiptap from '@/editor/Tiptap'
import { Document } from '@/editor/types'

export default function TextEditorApp() {
  const [documents, setDocuments] = useState<Document[]>([
    { id: '1', name: 'document1.txt', content: 'This is the content of document 1.' },
    { id: '2', name: 'document2.txt', content: 'This is the content of document 2.' },
    { id: '3', name: 'document3.txt', content: 'This is the content of document 3.' },
  ])
  const [activeFile, setActiveFile] = useState<string>(documents[0].id)
  const [isSidebarVisible, setIsSidebarVisible] = useState(true)

  const handleContentChange = (
    id: string,
    newContent: string,
    newSelection?: Selection
  ) => {
    setDocuments(documents.map(file =>
      file.id === id ? {
        ...file,
        content: newContent,
        selection: newSelection
      } : file
    ))
  }

  const closeFile = (id: string) => {
    const newFiles = documents.filter(file => file.id !== id)
    setDocuments(newFiles)
    if (activeFile === id && newFiles.length > 0) {
      setActiveFile(newFiles[0].id)
    }
  }

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible)
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
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
                  {documents.map((file) => (
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
            <div className="p-4 border-t">
              <Button className="w-full">
                <Vault className="mr-2 h-4 w-4" />
                Open vault
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Tabs value={activeFile} onValueChange={setActiveFile} className="flex-1 flex flex-col overflow-hidden">
          <ScrollArea className="w-full border-b" orientation="horizontal">
            <TabsList>
              {documents.map((file) => (
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
          {documents.map((document) => (
            <TabsContent key={document.id} value={document.id} className="flex-1 p-4 overflow-auto">
              <Tiptap document={document} handleContentChange={handleContentChange} />
              {/* <Textarea
                className="h-full w-full resize-none"
                value={file.content}
                onChange={(e) => handleContentChange(file.id, e.target.value)}
              /> */}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}

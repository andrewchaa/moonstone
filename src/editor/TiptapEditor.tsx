import { useState } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Selection } from '@tiptap/pm/state'
import Tiptap from '@/editor/Tiptap'
import { File } from '@/editor/types'

export default function TextEditorApp() {
  const [files, setFiles] = useState<File[]>([
    { id: '1', name: 'document1.txt', content: 'This is the content of document 1.' },
    { id: '2', name: 'document2.txt', content: 'This is the content of document 2.' },
    { id: '3', name: 'document3.txt', content: 'This is the content of document 3.' },
  ])
  const [activeFile, setActiveFile] = useState<string>(files[0].id)
  const [isSidebarVisible, setIsSidebarVisible] = useState(true)

  const handleContentChange = (
    id: string,
    newContent: string,
    newSelection?: Selection
  ) => {
    setFiles(files.map(file =>
      file.id === id ? {
        ...file,
        content: newContent,
        selection: newSelection
      } : file
    ))
  }

  const closeFile = (id: string) => {
    const newFiles = files.filter(file => file.id !== id)
    setFiles(newFiles)
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
          <ScrollArea className="flex-1">
            <div className="p-4">
              <h2 className="mb-4 text-lg font-semibold">Open Files</h2>
              <ul>
                {files.map((file) => (
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
        )}
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Tabs value={activeFile} onValueChange={setActiveFile} className="flex-1 flex flex-col overflow-hidden">
          <ScrollArea className="w-full border-b" orientation="horizontal">
            <TabsList>
              {files.map((file) => (
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
          {files.map((file) => (
            <TabsContent key={file.id} value={file.id} className="flex-1 p-4 overflow-auto">
              <Tiptap file={file} handleContentChange={handleContentChange} />
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

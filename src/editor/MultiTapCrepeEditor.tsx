import { useCallback, useEffect, useState } from 'react'
import { X, ChevronLeft, ChevronRight, Vault } from 'lucide-react'
import { debounce } from 'lodash'

import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { EditorDocument } from '@/editor/types'
import CrepeEditor from '@/editor/Crepe'
import OpenDocumentDialog from '@/editor/OpenDocumentDialog'

export default function MultiTabCrepeEditor() {
  const [vaultDocuments, setVaultDocuments] = useState<EditorDocument[]>([])
  const [openDocuments, setOpenDocuments] = useState<EditorDocument[]>([])
  const [activeFile, setActiveFile] = useState<string>('')
  const [isSidebarVisible, setIsSidebarVisible] = useState(true)
  const [openDocumentDialogOpen, setOpenDocumentDialogOpen] = useState(false)

  const saveContent = useCallback(debounce(async (id: string, content: string) => {
    const document = openDocuments.find(doc => doc.id === id)
    if (document?.filePath) {
      await window.electronAPI.writeFileContent(document)
    }
  }, 1000), [openDocuments])

  const handleContentChange = async (
    id: string,
    newContent: string,
    cursorPos?: number,
  ) => {
    setOpenDocuments(openDocuments.map(doc =>
      doc.id === id ? {
        ...doc,
        content: newContent,
        cursorPos,
      } : doc
    ))

    saveContent(id, newContent)
  }

  const closeFile = (id: string) => {
    const newFiles = openDocuments.filter(file => file.id !== id)
    setOpenDocuments(newFiles)
    if (activeFile === id && newFiles.length > 0) {
      setActiveFile(newFiles[0].id)
    }
  }

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible)
  }

  const openVault = async () => {
    const directoryDocuments = await window.electronAPI.openDirectorySelector()
    const newDocuments = directoryDocuments.filter(
      (doc: EditorDocument) => !vaultDocuments.some(
        (existingDoc: EditorDocument) => existingDoc.name === doc.name
      )
    )

    setVaultDocuments([...vaultDocuments, ...newDocuments])
  }

  useEffect(() => {
    window.electronAPI.onOpenDocument(() => {
      setOpenDocumentDialogOpen(true)
    })
  }, [openDocuments])

  useEffect(() => {
    window.electronAPI.onOpenVault(() => {
      openVault()
    })
  }, [])

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
            <div className="p-4 border-t">
              <Button className="w-full" onClick={openVault}>
                <Vault className="mr-2 h-4 w-4" />
                Open vault
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col overflow-hidden">

        <OpenDocumentDialog
          open={openDocumentDialogOpen}
          setOpen={setOpenDocumentDialogOpen}
          vaultDocuments={vaultDocuments}
          onSelect={(doc) => {
            if (!openDocuments.some(file => file.id === doc.id)) {
              setOpenDocuments([...openDocuments, doc])
            }
            setActiveFile(doc.id)
            setOpenDocumentDialogOpen(false)
          }}
        />

        <Tabs value={activeFile} onValueChange={setActiveFile} className="flex-1 flex flex-col overflow-hidden">
          <ScrollArea className="w-full border-b" orientation="horizontal">
            <TabsList>
              {openDocuments.map((file) => (
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
          {openDocuments.map((document) => (
            <TabsContent key={document.id} value={document.id} className="flex-1 p-4 overflow-auto">
              <CrepeEditor
                content={document.content}
                cursorPos={document.cursorPos}
                onChange={(markdown, selection) => handleContentChange(document.id, markdown, selection)}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}

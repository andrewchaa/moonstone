import { useCallback, useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { debounce } from 'lodash'

import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EditorDocument } from '@/types/DocumentTypes'
import CrepeEditor from '@/editor/Crepe'
import OpenDocumentDialog from '@/editor/OpenDocumentDialog'

import '@/types/electronAPI'
import Sidebar from '@/editor/Sidebar'

export default function MultiTabCrepeEditor() {
  const [vaultDocuments, setVaultDocuments] = useState<EditorDocument[]>([])
  const [openDocuments, setOpenDocuments] = useState<EditorDocument[]>([])
  const [activeFile, setActiveFile] = useState<string>('')
  const [isSidebarVisible, setIsSidebarVisible] = useState(true)
  const [openDocumentDialogOpen, setOpenDocumentDialogOpen] = useState(false)

  const saveContent = useCallback(
    debounce(async (filePath: string, content: string) => {
        await window.electronAPI.writeFileContent(filePath, content)
      },
      1000
    ), [openDocuments]
  )

  const handleContentChange = async (
    id: string,
    filePath: string,
    newContent: string,
    cursorPos?: number,
  ) => {
    setOpenDocuments(prevDocuments => {
      return prevDocuments.map(doc => doc.id === id ? {
        ...doc,
        content: newContent,
        cursorPos,
      } : doc
      )
    });

    await saveContent(filePath, newContent)

    setVaultDocuments(prevDocuments => {
      return prevDocuments.map(doc => doc.id === id ? {
        ...doc,
        content: newContent,
        cursorPos,
      } : doc
      )
    })
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
      <Sidebar
        isSidebarVisible={isSidebarVisible}
        toggleSidebar={toggleSidebar}
        openDocuments={openDocuments}
        setOpenDocuments={setOpenDocuments}
        setActiveFile={setActiveFile}
        vaultDocuments={vaultDocuments}
        openVault={openVault}
      />

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
                onChange={(markdown, selection) => handleContentChange(
                  document.id,
                  document.filePath,
                  markdown,
                  selection
                )}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}

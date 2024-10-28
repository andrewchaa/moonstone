import { useCallback, useEffect, useState } from 'react'
import { debounce } from 'lodash'

import { EditorDocument, VaultFile } from '@/types/DocumentTypes'
import OpenDocumentDialog from '@/editor/OpenDocumentDialog'
import '@/types/electronAPI'
import Sidebar from '@/editor/Sidebar'
import MultiTabs from '@/editor/MultiTabs'

export default function MoonstoneEditor() {
  const [vaultDocuments, setVaultDocuments] = useState<VaultFile[]>([])
  const [openDocuments, setOpenDocuments] = useState<EditorDocument[]>([])
  const [activeFile, setActiveFile] = useState<string>('')
  const [isSidebarVisible, setIsSidebarVisible] = useState(true)
  const [openDocumentDialogOpen, setOpenDocumentDialogOpen] = useState(false)

  const saveContent = useCallback(
    debounce(async (name: string, content: string) => {
        await window.electronAPI.writeFile(name, content)
      },
      3000
    ), [openDocuments]
  )

  const handleContentChange = async (
    id: string,
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

    await saveContent(id, newContent)
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
    const vaultFiles = await window.electronAPI.openDirectorySelector()
    const newFiles = vaultFiles.filter(
      (file: VaultFile) => !vaultDocuments.some(
        (existingFile: VaultFile) => existingFile.name === file.name
      )
    )

    setVaultDocuments([...vaultDocuments, ...newFiles])
  }

  useEffect(() => {
    window.electronAPI.onOpenDocumentDialog((files) => {
      setVaultDocuments(files)
      setOpenDocumentDialogOpen(true)
    })
    window.electronAPI.onLoadVault((files: VaultFile[]) => setVaultDocuments(files))
    window.electronAPI.onOpenVault(() => openVault())
    window.electronAPI.onCloseDocument((name: string) => {closeFile(name)})
    window.electronAPI.onOpenDocument((file: VaultFile) => {
      if (!openDocuments.some(doc => doc.id === file.name)) {
        const newDocument = {
          id: file.name,
          name: file.name,
          content: '',
          filePath: file.filePath,
        }
        setOpenDocuments([...openDocuments, newDocument])
      }
      setActiveFile(file.name)
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
      />

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col overflow-hidden">

        <OpenDocumentDialog
          open={openDocumentDialogOpen}
          setOpen={setOpenDocumentDialogOpen}
          files={vaultDocuments}
          onSelect={async (file) => {
            if (!openDocuments.some(doc => doc.id === file.name)) {
              const newDocument = {
                id: file.name,
                name: file.name,
                content: await window.electronAPI.readFile(file.filePath),
                filePath: file.filePath,
              }
              setOpenDocuments([...openDocuments, newDocument])
            }
            setActiveFile(file.name)
            setOpenDocumentDialogOpen(false)
          }}
        />

        <MultiTabs
          activeFile={activeFile}
          setActiveFile={setActiveFile}
          openDocuments={openDocuments}
          setOpenDocuments={setOpenDocuments}
          closeFile={closeFile}
          handleContentChange={handleContentChange}
        />
      </div>
    </div>
  )
}

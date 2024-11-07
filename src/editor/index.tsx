import { useCallback, useEffect, useState } from 'react'
import { debounce } from 'lodash'

import { EditorDocument, VaultFile } from '@/types/DocumentTypes'
import OpenDocumentDialog from '@/editor/OpenDocumentDialog'
import '@/types/electronAPI'
import MultiTabs from '@/editor/MultiTabs'
import { SidebarProvider } from "@/components/ui/sidebar"
import AppSidebar from "./AppSidebar"
import { useMoonstoneEditorContext } from '@/context/MoonstoneEditorContext'

export default function MoonstoneEditor() {
  const {
    vaultFiles,
    setVaultFiles,
    openDocuments,
    setOpenDocuments
  } = useMoonstoneEditorContext()
  const [activeDocument, setActiveDocument] = useState<EditorDocument>()
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
    const newDocuments = openDocuments.filter(file => file.id !== id)
    setOpenDocuments(newDocuments)
    if (activeDocument?.id === id && newDocuments.length > 0) {
      setActiveDocument(newDocuments[newDocuments.length - 1])
    }
  }

  const openVault = async () => {
    const vaultFiles = await window.electronAPI.openDirectorySelector()
    const newFiles = vaultFiles.filter(
      (file: VaultFile) => !vaultFiles.some(
        (existingFile: VaultFile) => existingFile.name === file.name
      )
    )

    setVaultFiles([...vaultFiles, ...newFiles])
  }

  useEffect(() => {
    window.electronAPI.onOpenDocumentDialog((files) => {
      setVaultFiles(files)
      setOpenDocumentDialogOpen(true)
    })
    window.electronAPI.onLoadVault((files: VaultFile[]) => setVaultFiles(files))
    window.electronAPI.onOpenVault(() => openVault())
    window.electronAPI.onCloseDocument((name: string) => { closeFile(name) })
    window.electronAPI.onOpenDocument((file: VaultFile) => {
      if (!openDocuments.some(doc => doc.id === file.name)) {
        const newDocument = {
          id: file.name,
          name: file.name,
          content: '',
          filePath: file.filePath,
        }
        setOpenDocuments([...openDocuments, newDocument])
        setActiveDocument(newDocument)
      }
    })

  }, [])

  return (
    <div className="flex h-screen bg-background">
      <SidebarProvider>
        <AppSidebar
          openDocuments={openDocuments}
          setOpenDocuments={setOpenDocuments}
          setActiveDocument={setActiveDocument}
          vaultFiles={vaultFiles}
        />
        <main className="overflow-x-hidden w-full">
          <MultiTabs
            activeDocument={activeDocument || openDocuments[0]}
            setActiveDocument={setActiveDocument}
            closeFile={closeFile}
            handleContentChange={handleContentChange}
          />
          <OpenDocumentDialog
            open={openDocumentDialogOpen}
            setOpen={setOpenDocumentDialogOpen}
            files={vaultFiles}
            onSelect={async (file) => {
              if (!openDocuments.some(doc => doc.id === file.name)) {
                const newDocument = {
                  id: file.name,
                  name: file.name,
                  content: await window.electronAPI.readFile(file.filePath),
                  filePath: file.filePath,
                }
                setOpenDocuments([...openDocuments, newDocument])
                setActiveDocument(newDocument)
              }
              setOpenDocumentDialogOpen(false)
            }}
          />
        </main>
      </SidebarProvider>
    </div>
  )
}

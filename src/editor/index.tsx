import { debounce } from "lodash"
import { useCallback, useState } from "react"

import { SidebarFiles } from "@/editor/SidebarFiles"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { useMoonstoneEditorContext } from "@/context/MoonstoneEditorContext"
import OpenDocumentDialog from "@/editor/OpenDocumentDialog"
import { VaultFile } from "@/types/DocumentTypes"
import { SidebarOutline } from "./SidebarOutline"
import TheEditor from "@/editor/TheEditor"
import Header from "@/editor/Header"
import { useActiveDocumentEffect, useOpenDocumentsEffect } from "@/hooks/useSerializationEffects"
import { useElectronAPI } from "@/hooks/use-electron-apis"
import NewDocumentDialog from "@/components/new-document-dialog"


export function MoonstoneEditor() {
  const {
    vaultFiles,
    setVaultFiles,
    openDocuments,
    setOpenDocuments,
    activeDocument,
    setActiveDocument,
  } = useMoonstoneEditorContext()
  const [openDocumentDialogOpen, setOpenDocumentDialogOpen] = useState(false)
  const saveContent = useCallback(
    debounce(async (name: string, content: string) => {
      await window.electronAPI.writeFile(name, content)
    }, 3000
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

  const closeDocument = (id: string) => {
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

  useActiveDocumentEffect(activeDocument, setActiveDocument)
  useOpenDocumentsEffect(openDocuments, setOpenDocuments)
  useElectronAPI(
    setOpenDocumentDialogOpen,
    openVault,
    closeDocument
  );

  return (
    <SidebarProvider>
      <SidebarFiles />
      <SidebarInset>
        <Header />
        <div className="mx-auto h-[100vh] w-full max-w-6xl bg-muted/50">
          <TheEditor
            content={activeDocument?.content || ''}
            cursorPos={activeDocument?.cursorPos}
            onChange={(markdown, selection) => {
              if (!activeDocument) {
                return
              }

              handleContentChange(activeDocument?.id, markdown, selection)
            }}
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

          <NewDocumentDialog />

        </div>
      </SidebarInset>

      <SidebarOutline />
    </SidebarProvider>
  )
}

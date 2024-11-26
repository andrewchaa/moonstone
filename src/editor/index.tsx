import { SidebarFiles } from "@/editor/SidebarFiles"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useMoonstoneEditorContext } from "@/context/MoonstoneEditorContext"
import OpenDocumentDialog from "@/editor/OpenDocumentDialog"
import { VaultFile } from "@/types/DocumentTypes"
import { debounce } from "lodash"
import { useCallback, useEffect, useState } from "react"
import { SidebarOutline } from "./SidebarOutline"
import CrepeEditor from "@/editor/Crepe"

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

  console.log('activeDocument', activeDocument)
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

  useEffect(() => {
    window.electronAPI.onOpenDocumentDialog((files) => {
      setVaultFiles(files)
      setOpenDocumentDialogOpen(true)
    })
    window.electronAPI.onLoadVault((files: VaultFile[]) => setVaultFiles(files))
    window.electronAPI.onOpenVault(() => openVault())
    window.electronAPI.onCloseDocument(() => {
      if (activeDocument) {
        closeDocument(activeDocument?.id)
      }
    })
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
    window.electronAPI.onSwitchDocument(() => {
      if (openDocuments.length > 1 && activeDocument) {
        const currentIndex = openDocuments.findIndex(doc => doc.id === activeDocument.id)
        const nextIndex = currentIndex === openDocuments.length - 1 ? 0 : currentIndex + 1
        setActiveDocument(openDocuments[nextIndex])
      }
    })
    window.electronAPI.onReverseSwitchDocument(() => {
      if (openDocuments.length > 1 && activeDocument) {
        const currentIndex = openDocuments.findIndex(doc => doc.id === activeDocument.id);
        const prevIndex = currentIndex === 0 ? openDocuments.length - 1 : currentIndex - 1;
        setActiveDocument(openDocuments[prevIndex]);
      }
    })
  }, [openDocuments, activeDocument])


  return (
    <SidebarProvider>
      <SidebarFiles />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 bg-background">
          <div className="flex flex-1 items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage className="line-clamp-1">
                    {activeDocument?.name || 'Untitled'}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="mx-auto h-[100vh] w-full max-w-6xl bg-muted/50">
          <CrepeEditor
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

          {/* <div className="mx-auto h-24 w-full max-w-3xl rounded-xl bg-muted/50" />
          <div className="mx-auto h-[100vh] w-full max-w-3xl rounded-xl bg-muted/50" /> */}
        </div>
      </SidebarInset>
      <SidebarOutline />
    </SidebarProvider>
  )
}

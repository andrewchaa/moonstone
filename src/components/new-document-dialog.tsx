import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { useDialogContext } from "@/context/dialog-context"
import { useMoonstoneEditorContext } from "@/context/MoonstoneEditorContext"

export default function NewDocumentDialog() {
  const {
    newDocumentDialogOpen, setNewDocumentDialogOpen,
    newDocumentName, setNewDocumentName,
  } = useDialogContext()
  const {
    openDocuments, setOpenDocuments,
    setActiveDocument,
  } = useMoonstoneEditorContext()

  return (
    <AlertDialog open={newDocumentDialogOpen} onOpenChange={setNewDocumentDialogOpen}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>New document</AlertDialogTitle>
        <AlertDialogDescription>
          Enter the name of the new document you want to create.
          <Input
            placeholder="Document name"
            className="mt-4"
            onChange={(e) => setNewDocumentName(e.target.value)}
            value={newDocumentName}
          />
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={async () => {
          const filename = `${newDocumentName}.md`
          const filePath = await window.electronAPI.writeFile(filename, '')
          const newDocument = {
            id: filename,
            name: filename,
            content: '',
            filePath: filePath,
          }
          setOpenDocuments([...openDocuments, newDocument])
          setActiveDocument(newDocument)
        }}>Continue</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>

  )
}

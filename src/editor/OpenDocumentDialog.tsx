import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
}

const OpenDocumentDialog = ({ open, setOpen }: Props) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Open document</DialogTitle>
          <DialogDescription>Select a document to open</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            Name
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            Username
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Open</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default OpenDocumentDialog;

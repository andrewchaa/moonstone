import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { EditorDocument } from "@/editor/types"
import { BookText } from "lucide-react"

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  vaultDocuments: EditorDocument[]
  onSelect: (doc: EditorDocument) => void
}

const OpenDocumentDialog = ({ open, setOpen, vaultDocuments, onSelect }: Props) => {
  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type the name of the document to open ..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Documenets from the vault">
          { vaultDocuments.map(doc => (
            <CommandItem key={doc.id} onSelect={() => onSelect(doc)}>
              <BookText />
              <span>{doc.name.replace(/\.md$/, '')}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}

export default OpenDocumentDialog;

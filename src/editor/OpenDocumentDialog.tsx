import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { VaultFile } from "@/types/DocumentTypes"
import { BookText } from "lucide-react"

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  files: VaultFile[]
  onSelect: (doc: VaultFile) => void
}

const OpenDocumentDialog = ({ open, setOpen, files, onSelect }: Props) => {
  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type the name of the document to open ..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Documenets from the vault">
          { files.map(file => (
            <CommandItem key={file.name} onSelect={() => onSelect(file)}>
              <BookText />
              <span>{file.name.replace(/\.md$/, '')}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}

export default OpenDocumentDialog;

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { useMoonstoneEditorContext } from "@/context/MoonstoneEditorContext"
import { VaultFile } from "@/types/DocumentTypes"
import { BookText } from "lucide-react"

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  files: VaultFile[]
  onSelect: (doc: VaultFile) => void
}

const OpenDocumentDialog = ({ open, setOpen, onSelect }: Props) => {
  const { vaultFiles } = useMoonstoneEditorContext()

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type the name of the document to open ..." />
      <CommandList>
        <CommandEmpty>
          No results found.
        </CommandEmpty>
        <CommandGroup heading="Documenets from the vault">
          {vaultFiles.map(file => (
            <CommandItem key={file.name} onSelect={() => onSelect(file)}>
              <BookText />
              <span>{file.name.replace(/\.md$/, '')}</span>
            </CommandItem>
          ))}
          <CommandItem key={'create-new-document'} onSelect={() => console.log('create a new file')}>
            <BookText />
            <span>Create a new document</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}

export default OpenDocumentDialog;

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useMoonstoneEditorContext } from "@/context/MoonstoneEditorContext"
import { EditorDocument } from "@/types/DocumentTypes"
import { CrossCircledIcon, DotsHorizontalIcon } from "@radix-ui/react-icons"

type Props = {
  documents: EditorDocument[]
}
export function NavOpenDocuments({ documents }: Props) {
  const {
    activeDocument, setActiveDocument,
    openDocuments, setOpenDocuments
  } = useMoonstoneEditorContext()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Documents</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {documents.map((document) => (
            <SidebarMenuItem key={`item-${document.id}`}>
              <SidebarMenuButton asChild
                isActive={activeDocument?.id === document.id}
                onClick={() => setActiveDocument(document)}
              >
                <a href="#">
                  <span>{document.name}</span>
                </a>
              </SidebarMenuButton>
              <SidebarMenuAction showOnHover
                onClick={() => {
                  const newDocuments = openDocuments.filter(openDoc => openDoc.id !== document.id)
                  setOpenDocuments(newDocuments)
                  if (activeDocument?.id === document.id && newDocuments.length > 0) {
                    setActiveDocument(newDocuments[newDocuments.length - 1])
                  }
                }}
              >
                <CrossCircledIcon />
              </SidebarMenuAction>
            </SidebarMenuItem>
          ))}
          <SidebarMenuItem>
            <SidebarMenuButton className="text-sidebar-foreground/70">
              <DotsHorizontalIcon />
              <span>More</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

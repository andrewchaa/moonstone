import { ChevronDown } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { EditorDocument, VaultFile } from "@/types/DocumentTypes"
import { Button } from "@/components/ui/button"

type Props = {
  openDocuments: EditorDocument[]
  setOpenDocuments: (documents: EditorDocument[]) => void
  setActiveFile: (id: string) => void
  vaultDocuments: VaultFile[]
}

export default function AppSidebar({
  openDocuments,
  setOpenDocuments,
  setActiveFile,
  vaultDocuments,
}: Props) {
  return (
    <Sidebar>
      <SidebarContent>

        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger>Application<ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" /></CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {openDocuments.map((doc) => (
                    <SidebarMenuItem key={doc.id}>
                      <SidebarMenuButton asChild>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => setActiveFile(doc.id)}
                        >
                          {doc.name}
                        </Button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>

        </Collapsible>
        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger>
                Vault
                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {vaultDocuments.map((file) => (
                    <SidebarMenuItem key={file.name}>
                      <SidebarMenuButton asChild>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={async () => {
                            if (!openDocuments.some(doc => doc.id === file.name)) {
                              const newDocument = {
                                id: file.name,
                                name: file.name,
                                content: await window.electronAPI.readFile(file.filePath),
                                filePath: file.filePath,
                              }
                              setOpenDocuments([...openDocuments, newDocument])
                              setActiveFile(file.name)
                            }
                          }}
                        >
                          {file.name}
                        </Button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

      </SidebarContent>
    </Sidebar>
  )
}

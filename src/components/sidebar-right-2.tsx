import * as React from "react"
import { GalleryVerticalEnd } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useMoonstoneEditorContext } from "../context/MoonstoneEditorContext"

export function SidebarRight2({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { documentHeadings } = useMoonstoneEditorContext()

  return (
    <Sidebar side='right' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Documentation</span>
                  <span className="">v1.0.0</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {
              documentHeadings
                .filter(heading => heading.depth < 3)
                .map((heading) => {
                  if (heading.depth === 1) {
                    return (
                      <SidebarMenuItem key={heading.text}>
                        <SidebarMenuButton asChild>
                          <a href='#' className="font-medium">
                            {heading.text}
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  }

                  return (
                    <SidebarMenuItem key={heading.text}>
                        <SidebarMenuSub>
                          <SidebarMenuSubItem key={heading.text}>
                            <SidebarMenuSubButton asChild isActive={true}>
                              <a href='#'>{heading.text}</a>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        </SidebarMenuSub>
                    </SidebarMenuItem>
                  )
                })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}

import * as React from "react"
import { GalleryVerticalEnd } from "lucide-react"
import { editorViewCtx } from '@milkdown/core';
import { Selection } from '@milkdown/prose/state';
import { outline } from "@milkdown/utils";

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
  const { crepeInstance, documentHeadings } = useMoonstoneEditorContext()

  const scrollToPosition = (pos: number) => {
    const view = crepeInstance?.editor.ctx.get(editorViewCtx)
    console.log('outline', outline()(crepeInstance?.editor.ctx))
    if (!view) {
      return
    }
    view.focus()

    console.log('view', view)
    console.log('scrolling to', pos)
    view.dispatch(
      view.state.tr.setSelection(Selection.near(view.state.doc.resolve(pos)))
    )
    view.dom.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })
    // view.dom.scrollTo(0, pos)
  }

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
                      <SidebarMenuItem key={heading.title}>
                        <SidebarMenuButton asChild
                          onClick={() => scrollToPosition(heading.pos)}
                        >
                          <a href='#' className="font-medium">
                            {heading.title}
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  }

                  return (
                    <SidebarMenuItem key={heading.title}>
                        <SidebarMenuSub>
                          <SidebarMenuSubItem key={heading.title}>
                            <SidebarMenuSubButton asChild isActive={true}>
                              <a href='#'>{heading.title}</a>
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

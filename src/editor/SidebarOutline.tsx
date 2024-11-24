import * as React from "react"
import { GalleryVerticalEnd } from "lucide-react"
import { editorViewCtx } from '@milkdown/core';

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

export function SidebarOutline({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { crepeInstance } = useMoonstoneEditorContext()
  const [headingElements, setHeadingElements] = React.useState<Element[]>([])

  React.useEffect(() => {
    const view = crepeInstance?.editor.ctx.get(editorViewCtx)
    const nodeList = view?.dom.querySelectorAll('h1, h2')
    setHeadingElements((nodeList ? Array.from(nodeList) : []))
  }, [crepeInstance?.editor.ctx])

  const scroll = (element: Element) => {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  // const scrollToPosition = (pos: number) => {
  //   const view = crepeInstance?.editor.ctx.get(editorViewCtx)
  //   console.log('outline', outline()(crepeInstance?.editor.ctx))
  //   if (!view) {
  //     return
  //   }

  //   view.dispatch(
  //     view.state.tr
  //       .setSelection(Selection.near(view.state.doc.resolve(pos)))
  //     // .scrollIntoView()
  //   )
  //   view.focus()
  //   view.dom.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })
  //   const domheadings = view.dom.querySelectorAll('h1, h2');
  //   console.log('dom', view.dom.querySelectorAll('h1, h2'))
  //   domheadings[20].scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })
  //   // view.dom.scrollTo(0, pos)
  // }

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
              headingElements
                .map((element) => {
                  if (element.nodeName === 'H1') {
                    return (
                      <SidebarMenuItem key={`${element.nodeName}${element.textContent}`}>
                        <SidebarMenuButton asChild
                          onClick={e => {
                            e.preventDefault();
                            scroll(element)
                          }}
                        >
                          <a href='#'>{element.textContent}</a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  }

                  return (
                    <SidebarMenuItem key={`${element.nodeName}${element.textContent}`}>
                      <SidebarMenuSub>
                        <SidebarMenuSubItem key={element.textContent}>
                          <SidebarMenuSubButton asChild isActive={true}
                            onClick={e => {
                              e.preventDefault();
                              scroll(element)
                            }}
                          >
                            <a href='#'>{element.textContent}</a>
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

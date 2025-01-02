import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useMoonstoneEditorContext } from "@/context/MoonstoneEditorContext"
import { filenameToTitle } from "@/utils/stringUtils"
import { Separator } from "@radix-ui/react-separator"

export default function Header() {
  const {
    openDocuments,
    setActiveDocument,
  } = useMoonstoneEditorContext()


  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 bg-background">
      <div className="flex flex-1 items-center gap-2 px-3">
        <SidebarTrigger />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            {openDocuments.map((doc) => {
              return (
                <>
                  <BreadcrumbItem key={doc.id}>
                    <BreadcrumbLink
                      className="line-clamp-1"
                      onClick={() => setActiveDocument(doc)}
                    >
                      <a href='#'>{filenameToTitle(doc.name)}</a>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator>
                    <Separator orientation="vertical" className="mr-2 h-4" />
                  </BreadcrumbSeparator>
                </>
              )
            })
            }
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>

  )
}

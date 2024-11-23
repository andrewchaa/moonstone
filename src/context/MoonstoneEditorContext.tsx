import { createContext, useContext, useState, ReactNode } from 'react';
import { DocumentHeading, EditorDocument, VaultFile } from '@/types/DocumentTypes';
import { Crepe } from '@milkdown/crepe';

type ContextType = {
  vaultFiles: VaultFile[]
  setVaultFiles: (files: VaultFile[]) => void
  openDocuments: EditorDocument[]
  setOpenDocuments: (documents: EditorDocument[]) => void
  activeDocument: EditorDocument | undefined
  setActiveDocument: (doc: EditorDocument) => void
  documentHeadings: DocumentHeading[]
  setDocumentHeadings: (headings: DocumentHeading[]) => void
  crepeInstance: Crepe | null
  setCrepeInstance: (crepe: Crepe | null) => void
}

type Prop = {
  children: ReactNode
}

const MoonstoneEditorContext = createContext<ContextType | undefined>(undefined);

export const MoonstoneEditorContextProvider = ({ children }: Prop) => {
  const [vaultFiles, setVaultFiles] = useState<VaultFile[]>([]);
  const [openDocuments, setOpenDocuments] = useState<EditorDocument[]>([]);
  const [activeDocument, setActiveDocument] = useState<EditorDocument>()
  const [documentHeadings, setDocumentHeadings] = useState<DocumentHeading[]>([])
  const [crepeInstance, setCrepeInstance] = useState<Crepe | null>(null)

  return (
    <MoonstoneEditorContext.Provider
      value={{
        vaultFiles, setVaultFiles,
        openDocuments, setOpenDocuments,
        activeDocument, setActiveDocument,
        documentHeadings, setDocumentHeadings,
        crepeInstance, setCrepeInstance
      }}
    >
      {children}
    </MoonstoneEditorContext.Provider>
  );
};

export const useMoonstoneEditorContext = () => {
  const context = useContext(MoonstoneEditorContext);
  if (context === undefined) {
    throw new Error('useDocumentContext must be used within a DocumentProvider');
  }
  return context;
};

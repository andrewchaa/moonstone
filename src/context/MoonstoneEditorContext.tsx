import { createContext, useContext, useState, ReactNode } from 'react';
import { DocumentHeading, EditorDocument, VaultFile } from '@/types/DocumentTypes';

type ContextType = {
  vaultFiles: VaultFile[]
  setVaultFiles: (files: VaultFile[]) => void
  openDocuments: EditorDocument[]
  setOpenDocuments: (documents: EditorDocument[]) => void
  activeDocument: EditorDocument | undefined
  setActiveDocument: (doc: EditorDocument) => void
  documentHeadings: DocumentHeading[]
  setDocumentHeadings: (headings: DocumentHeading[]) => void
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

  return (
    <MoonstoneEditorContext.Provider
      value={{
        vaultFiles, setVaultFiles,
        openDocuments, setOpenDocuments,
        activeDocument, setActiveDocument,
        documentHeadings, setDocumentHeadings
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

import { createContext, useContext, useState, ReactNode } from 'react';
import { EditorDocument, VaultFile } from '@/types/DocumentTypes';

type ContextType = {
  vaultFiles: VaultFile[]
  setVaultFiles: (files: VaultFile[]) => void
  openDocuments: EditorDocument[]
  setOpenDocuments: (documents: EditorDocument[]) => void
  activeDocument: EditorDocument | undefined
  setActiveDocument: (doc: EditorDocument) => void
}

type Prop = {
  children: ReactNode
}

const MoonstoneEditorContext = createContext<ContextType | undefined>(undefined);

export const MoonstoneEditorContextProvider = ({ children }: Prop) => {
  const [vaultFiles, setVaultFiles] = useState<VaultFile[]>([]);
  const [openDocuments, setOpenDocuments] = useState<EditorDocument[]>([]);
  const [activeDocument, setActiveDocument] = useState<EditorDocument>()

  return (
    <MoonstoneEditorContext.Provider
      value={{
        vaultFiles, setVaultFiles,
        openDocuments, setOpenDocuments,
        activeDocument, setActiveDocument
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

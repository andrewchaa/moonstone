import React, { createContext, useContext, useState, ReactNode } from 'react';
import { EditorDocument, VaultFile } from '@/types/DocumentTypes';

type ContextType = {
  vaultFiles: VaultFile[]
  setVaultFiles: React.Dispatch<React.SetStateAction<VaultFile[]>>
  openDocuments: EditorDocument[]
  setOpenDocuments: React.Dispatch<React.SetStateAction<EditorDocument[]>>
}

type Prop = {
  children: ReactNode
}

const MoonstoneEditorContext = createContext<ContextType | undefined>(undefined);

export const MoonstoneEditorContextProvider = ({ children }: Prop) => {
  const [vaultFiles, setVaultFiles] = useState<VaultFile[]>([]);
  const [openDocuments, setOpenDocuments] = useState<EditorDocument[]>([]);

  return (
    <MoonstoneEditorContext.Provider
      value={{ vaultFiles, setVaultFiles, openDocuments, setOpenDocuments }}
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

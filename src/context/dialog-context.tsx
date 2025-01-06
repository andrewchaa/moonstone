import { createContext, useContext, useState, ReactNode } from 'react';

type ContextType = {
  newDocumentDialogOpen: boolean;
  setNewDocumentDialogOpen: (open: boolean) => void;
  newDocumentName: string;
  setNewDocumentName: (name: string) => void;
}

const DialogContext = createContext<ContextType | undefined>(undefined);

export const DialogContextProvider = ({ children }: { children: ReactNode }) => {
  const [newDocumentDialogOpen, setNewDocumentDialogOpen] = useState(false);
  const [newDocumentName, setNewDocumentName] = useState('');

  return (
    <DialogContext.Provider
      value={{
        newDocumentDialogOpen, setNewDocumentDialogOpen,
        newDocumentName, setNewDocumentName
      }}
    >
      {children}
    </DialogContext.Provider>
  );
}

export const useDialogContext = () => {
  const context = useContext(DialogContext);
  if (context === undefined) {
    throw new Error('useDialogContext must be used within a DialogProvider');
  }
  return context;
}

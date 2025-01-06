import { useEffect } from 'react';
import { VaultFile } from '@/types/DocumentTypes';
import { useMoonstoneEditorContext } from '@/context/MoonstoneEditorContext';
import { useDialogContext } from '@/context/dialog-context';

export const useElectronAPI = (
  setOpenDocumentDialogOpen: (open: boolean) => void,
  openVault: () => Promise<void>,
  closeDocument: (id: string) => void
) => {
  const {
    activeDocument, setActiveDocument,
    openDocuments, setOpenDocuments,
    setVaultFiles
  } = useMoonstoneEditorContext();
  const { setNewDocumentDialogOpen } = useDialogContext();

  useEffect(() => {
    window.electronAPI.onOpenDocumentDialog((files) => {
      setVaultFiles(files);
      setOpenDocumentDialogOpen(true);
    });
    window.electronAPI.onLoadVault((files: VaultFile[]) => setVaultFiles(files));
    window.electronAPI.onOpenVault(() => openVault());
    window.electronAPI.onCloseDocument(() => {
      if (activeDocument) {
        closeDocument(activeDocument.id);
      }
    });
    window.electronAPI.onNewDocument(() => {
      setNewDocumentDialogOpen(true);
    });
    window.electronAPI.onSwitchDocument(() => {
      if (openDocuments.length > 1 && activeDocument) {
        const currentIndex = openDocuments.findIndex(
          (doc) => doc.id === activeDocument.id
        );
        const nextIndex =
          currentIndex === openDocuments.length - 1 ? 0 : currentIndex + 1;
        setActiveDocument(openDocuments[nextIndex]);
      }
    });
    window.electronAPI.onReverseSwitchDocument(() => {
      if (openDocuments.length > 1 && activeDocument) {
        const currentIndex = openDocuments.findIndex(
          (doc) => doc.id === activeDocument.id
        );
        const prevIndex =
          currentIndex === 0 ? openDocuments.length - 1 : currentIndex - 1;
        setActiveDocument(openDocuments[prevIndex]);
      }
    });
  }, [
    activeDocument,
    setActiveDocument,
    openDocuments,
    setOpenDocuments,
    setVaultFiles,
    setOpenDocumentDialogOpen,
    openVault,
    closeDocument,
  ]);
};

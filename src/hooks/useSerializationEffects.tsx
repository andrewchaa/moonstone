import { useEffect } from 'react';
import { EditorDocument } from '@/types/DocumentTypes';

export const useActiveDocumentEffect = (
  activeDocument: EditorDocument | undefined,
  setActiveDocument: (doc: EditorDocument) => void
) => {
  useEffect(() => {
    if (activeDocument) {
      (async () => await serialiseActiveDocumentDetails(activeDocument))();
    } else {
      (async () => await deserialiseActiveDocumentDetails(setActiveDocument))();
    }
  }, [activeDocument]);
};

// export const useOpenDocumentsEffect = (
//   openDocuments: EditorDocument[],
//   setOpenDocuments: (docs: EditorDocument[]) => void
// ) => {
//   useEffect(() => {
//     (async () => await serialiseOpenDocumentDetails(openDocuments))();
//   }, [openDocuments]);
// }

async function serialiseActiveDocumentDetails(activeDocument: EditorDocument) {
  await window.electronAPI.storeKeyValue(
    'active-document',
    JSON.stringify({ ...activeDocument, content: '' })
  );
}

async function deserialiseActiveDocumentDetails(setActiveDocument: (doc: EditorDocument) => void) {
  setActiveDocument(
    JSON.parse(await window.electronAPI.loadActiveDocument())
  );
}

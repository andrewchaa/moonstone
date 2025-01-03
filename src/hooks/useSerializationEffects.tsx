import { useEffect } from 'react';
import { EditorDocument } from '@/types/DocumentTypes';

export const useActiveDocumentEffect = (
  activeDocument: EditorDocument | undefined,
  setActiveDocument: (doc: EditorDocument) => void
) => {
  useEffect(() => {
    if (activeDocument) {
      (async () => await window.electronAPI.serializeKeyValue(
        'active-document',
        JSON.stringify({ ...activeDocument, content: '' })
      ))();
    } else {
      (async () => await deserialiseActiveDocumentDetails(setActiveDocument))();
    }
  }, [activeDocument]);
};

export const useOpenDocumentsEffect = (
  openDocuments: EditorDocument[],
  setOpenDocuments: (docs: EditorDocument[]) => void
) => {
  useEffect(() => {
    if (openDocuments.length > 0) {
      (async () => await window.electronAPI.serializeKeyValue(
        'open-documents',
        JSON.stringify(openDocuments.map(doc => ({ ...doc, content: '' })))
      ))();
    } else {
      (async () => await deserialiseOpenDocumentDetails(setOpenDocuments))();
    }
  }, [openDocuments]);
}

async function deserialiseActiveDocumentDetails(setActiveDocument: (doc: EditorDocument) => void) {
  setActiveDocument(
    JSON.parse(await window.electronAPI.loadActiveDocument())
  );
}

async function deserialiseOpenDocumentDetails(setOpenDocuments: (docs: EditorDocument[]) => void) {
  const docs = JSON.parse(await window.electronAPI.deserializeKeyValue('open-documents'));
  const openDocuments = await Promise.all(
    docs.map(async (doc: EditorDocument) => ({
      ...doc,
      content: await window.electronAPI.readFile(doc.filePath)
    }))
  );
  setOpenDocuments(
    openDocuments
  );
}

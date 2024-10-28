import { EditorDocument } from "@/types/DocumentTypes";

declare global {
  interface Window {
    electronAPI: {
      writeFileContent: (filePath: string, content: string) => Promise<void>;
      openDirectorySelector: () => Promise<EditorDocument[]>;
      onOpenDocument: (callback: () => void) => void;
      onOpenVault: (callback: () => void) => void;
    };
  }
}

// This is necessary to make the file a module and avoid the "Cannot redeclare block-scoped variable" error
export {};

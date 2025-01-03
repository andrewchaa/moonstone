import { VaultFile } from "@/types/DocumentTypes";

declare global {
  interface Window {
    electronAPI: {
      writeFile: (name: string, content: string) => Promise<void>;
      readFile: (filePath: string) => Promise<string>;
      deleteFile: (name: string) => Promise<void>;
      openDirectorySelector: () => Promise<VaultFile[]>;
      storeKeyValue: (key: string, value: string) => Promise<void>;
      loadActiveDocument: () => Promise<string>;

      onOpenDocumentDialog: (callback: (files: VaultFile[]) => void) => void;
      onOpenDocument: (callback: (file: VaultFile) => void) => void;
      onCloseDocument: (callback: (name: string) => void) => void;
      onOpenVault: (callback: () => void) => void;
      onLoadVault: (callback: (files: VaultFile[]) => void) => void;
      onSwitchDocument: (callback: () => void) => void;
      onReverseSwitchDocument: (callback: () => void) => void;
    };
  }
}

// This is necessary to make the file a module and avoid the "Cannot redeclare block-scoped variable" error
export {};

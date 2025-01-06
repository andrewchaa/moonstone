import React from 'react';
import { MoonstoneEditor } from '@/editor/index';
import { MoonstoneEditorContextProvider } from '@/context/MoonstoneEditorContext';
import { DialogContextProvider } from '@/context/dialog-context';
import './index.css';
import '../globals.css';


const App: React.FC = () => {
  return (
    <MoonstoneEditorContextProvider>
      <DialogContextProvider>
        <MoonstoneEditor />
      </DialogContextProvider>
    </MoonstoneEditorContextProvider>
  );
};

export default App;

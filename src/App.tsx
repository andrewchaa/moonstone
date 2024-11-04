import React from 'react';
import MoonstoneEditor from '@/editor';
import { MoonstoneEditorContextProvider } from '@/context/MoonstoneEditorContext';
import './index.css';
import '../globals.css';


const App: React.FC = () => {
  return (
    <MoonstoneEditorContextProvider>
      <MoonstoneEditor />
    </MoonstoneEditorContextProvider>
  );
};

export default App;

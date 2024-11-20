import React from 'react';
import MoonstoneEditor from '@/editor';
import { MoonstoneEditorContextProvider } from '@/context/MoonstoneEditorContext';
import { Page } from '@/examples/two-sidebars'
import './index.css';
import '../globals.css';


const App: React.FC = () => {
  return (
    <MoonstoneEditorContextProvider>
      {/* <MoonstoneEditor /> */}
      <Page />
    </MoonstoneEditorContextProvider>
  );
};

export default App;

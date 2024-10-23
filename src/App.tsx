import React from 'react';
import MkeEditor from '@/editor/MkeEditor';
import { Mke } from '@/editor/Mke';
import { MilkdownProvider } from '@milkdown/react';
import CrepeEditor from '@/editor/Crepe';


const App: React.FC = () => {
  return (
    // <div><MkeEditor /></div>
    // <div>
    //   <MilkdownProvider>
    //     <Mke document={{ id: '1', content: 'Hello' }} handleContentChange={()=> {}} />
    //   </MilkdownProvider>
    // </div>
    <div>
      <CrepeEditor content="Hello" onChange={() => {}} />
    </div>
  );
};

export default App;

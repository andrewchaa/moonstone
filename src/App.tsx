import React from 'react';
import TiptapEditor from './editor/TiptapEditor';
import { MilkdownProvider } from '@milkdown/react'
import { MilkdownEditor } from './editor/MilkdownEditor';


// const App: React.FC = () => {
//   return (
//     <div>
//       {/* <MultiTabEditor /> */}
//       <TiptapEditor />
//     </div>
//   );
// };
const App: React.FC = () => {
  return (
    <div>
      <MilkdownProvider>
        <MilkdownEditor />
      </MilkdownProvider>
    </div>
  );
};

export default App;

import './styles.scss';

import React from 'react';
import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import { EditorProvider, useCurrentEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle.configure({ types: [ListItem.name] }),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false,
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false,
    },
  }),
]
const content = '<p>Hello World! 🌍️</p>'

const Tiptap = () => {
  return (
    <div className='tiptap'>
      <EditorProvider extensions={extensions} content={content}>
      </EditorProvider>
    </div>
  )
}

export default Tiptap

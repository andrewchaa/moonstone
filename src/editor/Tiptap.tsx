import '../styles.scss'

import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import Highlight from '@tiptap/extension-highlight'
import Typography from '@tiptap/extension-typography'
import { Markdown } from 'tiptap-markdown'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect } from 'react'
import { Selection } from '@tiptap/pm/state'
import { Document } from './types'

const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle.configure({ types: [ListItem.name] }),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
  }),
  Highlight,
  Markdown,
  Typography,
]

type Props = {
  document: Document
  selection?: Selection | null
  handleContentChange: (
    id: string,
    newContent: string,
    selection?: Selection
  ) => void
}

const Tiptap = ({ document, handleContentChange }: Props) => {
  const editor = useEditor({
    extensions,
    content: document.content,
    onDestroy: (props) => {
      console.log('destroyed', props)
    },
    onBlur(props) {
      console.log('blur', props)
      handleContentChange(
        document.id,
        props.editor.getHTML(),
        props.editor.state.selection
      )
    },
    onFocus(props) {
      console.log('focus', props)
    },
    onBeforeCreate(props) {
      console.log('before create', props)
    },
    onCreate(props) {
      console.log('create', props)
      props.editor.commands.focus()
      if (document.selection) {
        props.editor.commands.setTextSelection(document.selection)
      }
    },
    onUpdate: async (props) => {
      console.log('update', props)
      await window.electronAPI.writeFileContent({...document, content: props.editor.getHTML()})
    }
  })

  return (
    <div className="tiptap">
      <EditorContent editor={editor} />
    </div>
  )
}

export default Tiptap;

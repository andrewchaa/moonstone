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
  content: string
  selection?: Selection | null
  handleUpdate: (
    content: string,
    selection: Selection | null
  ) => void
}

const Tiptap = ({ content, selection, handleUpdate }: Props) => {
  const editor = useEditor({
    extensions,
    content,
    onDestroy: (props) => {
      console.log('destroyed', props)
    },
    onBlur(props) {
      console.log('blur', props)
      handleUpdate(props.editor.getHTML(), props.editor.state.selection)
    },
    onFocus(props) {
      console.log('focus', props)
    },
    onBeforeCreate(props) {
      console.log('before create', props)
    },
    onCreate(props) {
      console.log('create', props)
    },
    onUpdate: (props) => {
      console.log('update', props)
    }
  })

  useEffect(() => {
    if (editor) {
      editor.commands.focus()
      editor.commands.setContent(content)

      if (selection) {
        editor.commands.setTextSelection(selection)
      }
    }

  }, [content, editor, selection])

  return (
    <div className="tiptap">
      <EditorContent editor={editor} />
    </div>
  )
}

export default Tiptap;

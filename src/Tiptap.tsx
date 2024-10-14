import { useEditor, EditorContent, FloatingMenu, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React from 'react';

const extensions = [StarterKit]
const content = '<p>Hello World! 🌍️</p>'

const Tiptap = () => {
  const editor = useEditor({
    extensions,
    content,
  })

  return (
    <>
      <EditorContent editor={editor} />
      <FloatingMenu editor={null}>
        This is the floating menu
      </FloatingMenu>
      <BubbleMenu editor={null}>
        This is the bubble menu
      </BubbleMenu>
    </>
  )
}

export default Tiptap

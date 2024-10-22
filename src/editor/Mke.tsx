import '../index.css';
import { defaultValueCtx, Editor, rootCtx } from '@milkdown/kit/core';
import { useState, type FC } from 'react';
import { Milkdown, MilkdownProvider, useEditor } from '@milkdown/react'
import { commonmark } from '@milkdown/kit/preset/commonmark';
import { gfm } from '@milkdown/preset-gfm';
import { history } from '@milkdown/plugin-history';
import { listener, listenerCtx } from '@milkdown/plugin-listener';
import { nord } from '@milkdown/theme-nord';

import '@milkdown/theme-nord/style.css';
import { EditorDocument } from '@/editor/types';

type Props = {
  document: EditorDocument
  handleContentChange: (id: string, newContent: string) => void
}

export const Mke = ({ document, handleContentChange }: Props) => {
  const [markdownContent, setMarkdownContent] = useState<string>('Hello')
  useEditor((root) => {
    return Editor
      .make()
      .config(ctx => {
        ctx.set(rootCtx, root)
        ctx.set(defaultValueCtx, document?.content || '')
        ctx.get(listenerCtx)
          .markdownUpdated((_, markdown) => handleContentChange(document.id, markdown))
      })
      .config(nord)
      .use(listener)
      .use(commonmark)
      .use(gfm)
      .use(history)
  }, [])

  return <Milkdown />
}

import '../index.css';
import { defaultValueCtx, Editor, rootCtx } from '@milkdown/kit/core';
import { useState, type FC } from 'react';
import { Milkdown, useEditor } from '@milkdown/react'
import { commonmark } from '@milkdown/kit/preset/commonmark';
import { gfm } from '@milkdown/preset-gfm';
import { history } from '@milkdown/plugin-history';
import { listener, listenerCtx } from '@milkdown/plugin-listener';
import { nord } from '@milkdown/theme-nord';

import '@milkdown/theme-nord/style.css';

export const MilkdownEditor: FC = () => {
  const [markdownContent, setMarkdownContent] = useState<string>('Hello')

  console.log('content', markdownContent)
  useEditor((root) => {
    return Editor
      .make()
      .config(ctx => {
        ctx.set(rootCtx, root)
        ctx.set(defaultValueCtx, markdownContent)
        ctx.get(listenerCtx)
          .markdownUpdated((_, markdown) => setMarkdownContent(markdown))
      })
      .config(nord)
      .use(listener)
      .use(commonmark)
      .use(gfm)
      .use(history)
  }, [])

  return <Milkdown />
}

import React, { MutableRefObject, useLayoutEffect, useRef } from 'react';
import { Crepe } from '@milkdown/crepe';
import { listener, listenerCtx } from '@milkdown/plugin-listener';
import { editorViewCtx } from '@milkdown/core';
import { Selection } from '@milkdown/prose/state';
import "@milkdown/crepe/theme/common/style.css";
import "@milkdown/crepe/theme/nord.css";
import "./crepe.css";
import { useMoonstoneEditorContext } from '../context/MoonstoneEditorContext';

type Props = {
  content: string
  cursorPos?: number
  onChange: (markdown: string, cursorPos: number) => void
  // onTocChange: (headings: DocumentHeading[]) => void
}

const CrepeEditor: React.FC<Props> = ({ content, cursorPos, onChange }) => {
  const { setCrepeInstance } = useMoonstoneEditorContext();
  const crepeRef = useRef<Crepe>(null);
  const divRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!divRef.current) {
      return;
    }

    const crepe = new Crepe({
      root: divRef.current,
      defaultValue: content,
    });

    crepe.editor.config((ctx) => {
      ctx.get(listenerCtx)
        .markdownUpdated((ctx, markdown) => {
          onChange(markdown, ctx.get(editorViewCtx).state.selection.from)
          // const doc = ctx.get(editorViewCtx).state.doc;
          // const headings: DocumentHeading[] = [];

          // doc.descendants((node, pos) => {
          //   if (node.type.name === 'heading') {
          //     const depth = node.attrs.level;
          //     const text = node.textContent;
          //     headings.push({ depth, title: text, pos });
          //   }
          // });
          // console.log(headings);
          // onTocChange(headings);
        })
    })
    .use(listener)

    crepe.create().then(() => {
      (crepeRef as MutableRefObject<Crepe>).current = crepe;
      setCrepeInstance(crepe);
      crepe.editor.ctx.get(editorViewCtx).focus();

      if (cursorPos) {
        const view = crepe.editor.ctx.get(editorViewCtx);
        view.dispatch(
          view.state.tr.setSelection(Selection.near(view.state.doc.resolve(cursorPos))
        ));
      }
    })

    return () => {
      crepe.destroy();
      setCrepeInstance(null);
    }
  }, [content]);

  return (<div className="crepe flex h-full flex-1 flex-col" ref={divRef} />)
};

export default CrepeEditor;

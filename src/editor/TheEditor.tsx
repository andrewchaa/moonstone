import { Crepe } from '@milkdown/crepe';
import { editorViewCtx, parserCtx } from '@milkdown/core';
import { listener, listenerCtx } from '@milkdown/plugin-listener';
import { Slice } from '@milkdown/kit/prose/model';
import { Selection } from '@milkdown/kit/prose/state';
import { getMarkdown } from '@milkdown/kit/utils';
import { eclipse } from '@uiw/codemirror-theme-eclipse'
import { throttle } from 'lodash';
import { FC, MutableRefObject, useLayoutEffect, useRef } from 'react';
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

const TheEditor: FC<Props> = ({ content, cursorPos, onChange }) => {
  const crepeRef = useRef<Crepe>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const { setCrepeInstance } = useMoonstoneEditorContext();

  useLayoutEffect(() => {
    if (!divRef.current) {
      return;
    }

    const crepe = new Crepe({
      root: divRef.current,
      defaultValue: content,
      featureConfigs: {
        [Crepe.Feature.CodeMirror]: {
          theme: eclipse
        },
        [Crepe.Feature.LinkTooltip]: {
          onCopyLink: () => {
            console.log('link copied');
          }
        }
      },
    });

    crepe.editor.config((ctx) => {
      ctx.get(listenerCtx).markdownUpdated(throttle((ctx, markdown) => {
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
        }, 200))
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

export default TheEditor;

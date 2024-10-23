import React, { MutableRefObject, useLayoutEffect, useRef } from 'react';
import { Crepe } from '@milkdown/crepe';
import { listener, listenerCtx } from '@milkdown/plugin-listener';
import "@milkdown/crepe/theme/common/style.css";
import "@milkdown/crepe/theme/frame.css";

interface CrepeEditorProps {
  content: string;
  onChange?: (markdown: string) => void;
}

const CrepeEditor: React.FC<CrepeEditorProps> = ({ content, onChange }) => {
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
        .markdownUpdated((_, markdown) => onChange?.(markdown))
    })
      .use(listener)

    crepe.create().then(() => {
      (crepeRef as MutableRefObject<Crepe>).current = crepe;
    })


    return () => {
      crepe.destroy();
    }
  }, []);

  return <div className="crepe flex h-full flex-1 flex-col" ref={divRef} />
};

export default CrepeEditor;

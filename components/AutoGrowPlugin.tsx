import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

export function AutoGrowPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const rootElement = editor.getRootElement();
        if (rootElement) {
          rootElement.style.height = 'auto';
          rootElement.style.height = rootElement.scrollHeight + 'px';
        }
      });
    });
  }, [editor]);

  return null;
}
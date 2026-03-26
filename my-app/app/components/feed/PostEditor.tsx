"use client";

import { useEffect } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { HashtagPlugin } from "@lexical/react/LexicalHashtagPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HashtagNode } from "@lexical/hashtag";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot, $createParagraphNode, $createTextNode } from "lexical";

// ─────────────────────────────────────────────────────────────────────────────
// ExternalValuePlugin
// Watches the `value` prop. When it changes externally (e.g. AI text),
// pushes the new content into Lexical. The currentText check prevents
// overwriting while the user is typing.
// ─────────────────────────────────────────────────────────────────────────────
function ExternalValuePlugin({ value }: { value: string }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.getEditorState().read(() => {
      const currentText = $getRoot().getTextContent();
      if (currentText === value) return; // already in sync — skip

      editor.update(() => {
        const root = $getRoot();
        root.clear();
        const paragraph = $createParagraphNode();
        paragraph.append($createTextNode(value));
        root.append(paragraph);
      });
    });
  }, [value, editor]);

  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// PostEditor
// ─────────────────────────────────────────────────────────────────────────────
export default function PostEditor({
  value,
  setValue,
}: {
  value: string;
  setValue: (v: string) => void;
}) {
  const config = {
    namespace: "PostEditor",
    theme: {
      paragraph: "text-white",
      hashtag: "text-[#7D42F5] font-semibold",
    },
    nodes: [HashtagNode],
    onError(error: Error) {
      console.error(error);
    },
  };

  return (
    <LexicalComposer initialConfig={config}>
      <div className="relative w-full min-h-[200px]">
        <RichTextPlugin
          contentEditable={
            <ContentEditable className="w-full min-h-[200px] p-6 bg-[#2a2a2a] rounded-2xl outline-none text-white" />
          }
          placeholder={
            <div className="absolute top-6 left-6 text-gray-400 pointer-events-none">
              Write what's on your mind...
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
      </div>

      <HistoryPlugin />
      <HashtagPlugin />

      {/* Pushes AI-generated (or any external) text into the editor */}
      <ExternalValuePlugin value={value} />

      {/* Syncs editor content back up to parent */}
      <OnChangePlugin
        onChange={(editorState) => {
          editorState.read(() => {
            setValue($getRoot().getTextContent());
          });
        }}
      />
    </LexicalComposer>
  );
}
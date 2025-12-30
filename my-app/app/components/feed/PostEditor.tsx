"use client";

import {
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { HashtagPlugin } from "@lexical/react/LexicalHashtagPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HashtagNode } from "@lexical/hashtag";
import { $getRoot } from "lexical";

export default function PostEditor({ value, setValue }) {
  const config = {
    namespace: "PostEditor",
    theme: {
      paragraph: "text-white",
      hashtag: "text-[#7D42F5] font-semibold",
    },
    nodes: [HashtagNode],
    onError(error) {
      console.error(error);
    },
  };

  return (
    <LexicalComposer initialConfig={config}>
      <div className="relative w-full min-h-[200px]">
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              className="w-full min-h-[200px] p-6 bg-[#2a2a2a] rounded-2xl outline-none text-white"
            />
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

      <OnChangePlugin
  onChange={(editorState) => {
    editorState.read(() => {
      const plainText = $getRoot().getTextContent(); 
      setValue(plainText); // this will be "nlewjgnwe #power"
    });
  }}
/>
    </LexicalComposer>
  );
}

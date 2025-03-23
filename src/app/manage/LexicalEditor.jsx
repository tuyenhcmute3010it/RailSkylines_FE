"use client";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useCallback, memo } from "react";
import { ListItemNode, ListNode } from "@lexical/list";
import { LinkNode } from "@lexical/link";

// 🎨 Thanh công cụ tùy chỉnh
const Toolbar = () => {
  const [editor] = useLexicalComposerContext();

  // ✅ Ngăn chặn refresh khi bấm nút
  const handleCommand = (event, command) => {
    event.preventDefault();
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, command);
  };

  return (
    <div className="toolbar flex gap-2 p-2 border-b">
      <button
        onClick={(e) => handleCommand(e, "bold")}
        className="p-1 border rounded"
      >
        <strong>B</strong>
      </button>
      <button
        onClick={(e) => handleCommand(e, "italic")}
        className="p-1 border rounded"
      >
        <em>I</em>
      </button>
      <button
        onClick={(e) => handleCommand(e, "underline")}
        className="p-1 border rounded"
      >
        <u>U</u>
      </button>
    </div>
  );
};

// 🔧 Cấu hình ban đầu
const initialConfig = {
  namespace: "MyEditor",
  onError: (error) => console.error(error),
  nodes: [ListNode, ListItemNode, LinkNode], // Hỗ trợ danh sách & liên kết
};

// 📝 Editor chính
const LexicalEditor = ({ value, onChange }) => {
  const handleChange = useCallback(
    (editorState) => {
      editorState.read(() => {
        const json = editorState.toJSON();
        onChange(JSON.stringify(json)); // Lưu dữ liệu dạng JSON
      });
    },
    [onChange]
  );

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <Toolbar />
      <RichTextPlugin
        contentEditable={
          <ContentEditable className="min-h-[200px] border p-2" />
        }
        placeholder={<div className="text-gray-400">Enter some text...</div>}
      />
      <HistoryPlugin />
      <OnChangePlugin onChange={handleChange} />
      <ListPlugin />
      <LinkPlugin />
    </LexicalComposer>
  );
};

// ✅ Dùng memo để tránh re-render khi không cần thiết
export default memo(LexicalEditor);

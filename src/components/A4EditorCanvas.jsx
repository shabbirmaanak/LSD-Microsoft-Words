import React, { useEffect } from 'react';
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import FontFamily from '@tiptap/extension-font-family';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Image from '@tiptap/extension-image';
import { FontSize } from '../extensions/FontSize';
import { Bold, Italic, Underline as UnderlineIcon, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

export default function A4EditorCanvas({
  content,
  onContentChange,
  watermark,
  margins,
  orientation,
  paperColor,
  textDirection,
  zoomLevel,
  setEditorInstance
}) {
  const marginPaddingMap = {
    normal: 'p-16', // ~1 inch
    narrow: 'p-8',  // ~0.5 inch
    wide: 'p-24',   // ~1.5 inch
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: true,
      }),
      TextStyle,
      FontFamily,
      FontSize,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
        defaultAlignment: textDirection === 'rtl' ? 'right' : 'left',
      }),
      Underline,
      Subscript,
      Superscript,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Image,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onContentChange(editor.getHTML(), editor.getText());
    },
  });

  // Share editor instance with parent app & ribbon
  useEffect(() => {
    if (editor) {
      setEditorInstance(editor);
    }
  }, [editor, setEditorInstance]);

  return (
    <div className={`flex-1 bg-[#e8ecef] overflow-auto relative flex flex-col items-center py-6 px-4 no-print select-text ${textDirection === 'rtl' ? 'rtl-editor' : 'ltr-editor'}`}>
      
      {/* Top Horizontal Ruler */}
      <div className="w-[794px] h-6 bg-white border border-gray-300 mb-2 flex items-center px-16 text-[10px] text-gray-500 justify-between select-none shadow-xs rounded-t-sm" dir={textDirection}>
        <span>٠</span>
        <span>١</span>
        <span>٢</span>
        <span>٣</span>
        <span>٤</span>
        <span>٥</span>
        <span>٦</span>
        <span>٧</span>
        <span>٨</span>
      </div>

      {/* A4 Paper Container with Zoom Scaling */}
      <div 
        className="transition-transform origin-top duration-150 ease-out"
        style={{ transform: `scale(${zoomLevel / 100})` }}
      >
        <div 
          id="letter-paper-canvas"
          dir={textDirection}
          className={`a4-paper paper-margin-guide ${marginPaddingMap[margins] || 'p-16'} transition-all`}
          style={{ backgroundColor: paperColor || '#ffffff' }}
        >
          {/* Watermark Overlay */}
          {watermark && (
            <div className="watermark-text">
              {watermark}
            </div>
          )}

          {/* Floating Bubble Formatting Toolbar */}
          {editor && (
            <BubbleMenu 
              editor={editor} 
              tippyOptions={{ duration: 100 }}
              className="bg-gray-900 text-white rounded-lg shadow-xl px-2 py-1 flex items-center gap-1 border border-gray-700 text-xs z-50"
            >
              <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-1 hover:bg-gray-800 rounded ${editor.isActive('bold') ? 'text-[#046a38] font-bold' : 'text-gray-300'}`}
              >
                <Bold className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`p-1 hover:bg-gray-800 rounded ${editor.isActive('italic') ? 'text-[#046a38]' : 'text-gray-300'}`}
              >
                <Italic className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={`p-1 hover:bg-gray-800 rounded ${editor.isActive('underline') ? 'text-[#046a38]' : 'text-gray-300'}`}
              >
                <UnderlineIcon className="w-3.5 h-3.5" />
              </button>
              <div className="w-[1px] h-3 bg-gray-700 mx-1"></div>
              <button
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                className="p-1 hover:bg-gray-800 rounded text-gray-300"
              >
                <AlignRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                className="p-1 hover:bg-gray-800 rounded text-gray-300"
              >
                <AlignCenter className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                className="p-1 hover:bg-gray-800 rounded text-gray-300"
              >
                <AlignLeft className="w-3.5 h-3.5" />
              </button>
            </BubbleMenu>
          )}

          {/* Tiptap Rich Text Content Editable Viewport */}
          <EditorContent 
            editor={editor} 
            className="h-full min-h-[950px] font-serif leading-relaxed text-gray-900 focus:outline-none"
          />
        </div>
      </div>

    </div>
  );
}

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
    editorProps: {
      handleKeyDown: (view, event) => {
        const { $from } = view.state.selection;
        const charBefore = $from.nodeBefore?.text ? $from.nodeBefore.text.slice(-1) : '';

        // Double-key replacements (e.g. سس => ے, ss => ے, ee => پ, ;; => گ, pp => چ)
        if (!event.ctrlKey && !event.metaKey && !event.altKey) {
          // س + س OR s + s => ے (Bari Ye)
          if ((event.key === 'س' && charBefore === 'س') || (event.key === 's' && charBefore === 's')) {
            const tr = view.state.tr.delete($from.pos - 1, $from.pos).insertText('ے');
            view.dispatch(tr);
            return true;
          }
          // e + e OR پ + پ => پ (Pe)
          if ((event.key === 'e' && charBefore === 'e') || (event.key === 'پ' && charBefore === 'پ')) {
            const tr = view.state.tr.delete($from.pos - 1, $from.pos).insertText('پ');
            view.dispatch(tr);
            return true;
          }
          // ; + ; OR ك + ك => گ (Gaf)
          if ((event.key === ';' && charBefore === ';') || (event.key === 'ك' && charBefore === 'ك')) {
            const tr = view.state.tr.delete($from.pos - 1, $from.pos).insertText('گ');
            view.dispatch(tr);
            return true;
          }
          // p + p OR چ + چ => چ (Che)
          if ((event.key === 'p' && charBefore === 'p') || (event.key === 'چ' && charBefore === 'چ')) {
            const tr = view.state.tr.delete($from.pos - 1, $from.pos).insertText('چ');
            view.dispatch(tr);
            return true;
          }
          // q + q OR ط + ط => ٹ (Tte)
          if ((event.key === 'q' && charBefore === 'q') || (event.key === 'ط' && charBefore === 'ط')) {
            const tr = view.state.tr.delete($from.pos - 1, $from.pos).insertText('ٹ');
            view.dispatch(tr);
            return true;
          }
          // ح + ح => ھ (Do-chashmi He)
          if (event.key === 'ح' && charBefore === 'ح') {
            const tr = view.state.tr.delete($from.pos - 1, $from.pos).insertText('ھ');
            view.dispatch(tr);
            return true;
          }
        }

        // Single Shift Shortcuts (Shift + P -> چ, Shift + K -> گ, Shift + Z -> ژ, etc)
        if (event.shiftKey && !event.ctrlKey && !event.metaKey) {
          if (event.key === 'P') { // Shift + P -> چ
            view.dispatch(view.state.tr.insertText('چ'));
            return true;
          }
          if (event.key === 'K') { // Shift + K -> گ
            view.dispatch(view.state.tr.insertText('گ'));
            return true;
          }
          if (event.key === 'Z') { // Shift + Z -> ژ
            view.dispatch(view.state.tr.insertText('ژ'));
            return true;
          }
          if (event.key === 'N') { // Shift + N -> ں
            view.dispatch(view.state.tr.insertText('ں'));
            return true;
          }
          if (event.key === 'C') { // Shift + C -> ۓ
            view.dispatch(view.state.tr.insertText('ۓ'));
            return true;
          }
        }
        return false;
      },
    },
  });

  // Share editor instance with parent app & ribbon
  useEffect(() => {
    if (editor) {
      setEditorInstance(editor);
    }
  }, [editor, setEditorInstance]);

  const isLandscape = orientation === 'landscape';
  const maxWidthClass = isLandscape ? 'max-w-[1123px]' : 'max-w-[794px]';

  return (
    <div className={`flex-1 bg-[#e8ecef] overflow-auto relative flex flex-col items-center py-6 px-4 no-print select-text ${textDirection === 'rtl' ? 'rtl-editor' : 'ltr-editor'}`}>
      
      {/* Top Horizontal Ruler (Hidden on small mobile) */}
      <div className={`hidden sm:flex ${maxWidthClass} w-full h-6 bg-white border border-gray-300 mb-2 items-center px-16 text-[10px] text-gray-500 justify-between select-none shadow-xs rounded-t-sm`} dir={textDirection}>
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
        className={`w-full ${maxWidthClass} transition-all origin-top duration-150 ease-out flex justify-center`}
        style={{ transform: `scale(${zoomLevel / 100})` }}
      >
        <div 
          id="letter-paper-canvas"
          dir={textDirection}
          className={`a4-paper ${isLandscape ? 'a4-landscape' : ''} paper-margin-guide ${marginPaddingMap[margins] || 'p-16'} transition-all`}
          style={{ backgroundColor: paperColor || '#ffffff' }}
        >
          {/* Watermark Overlay */}
          {watermark && (
            <div className="watermark-text">
              {watermark}
            </div>
          )}

          {/* Floating Table Action Bar (Visible when cursor is inside a Table cell) */}
          {editor && (
            <BubbleMenu
              editor={editor}
              shouldShow={({ editor }) => editor.isActive('table')}
              tippyOptions={{ duration: 100, placement: 'top' }}
              className="bg-slate-900 text-white rounded-lg shadow-2xl px-2.5 py-1.5 flex items-center gap-1.5 border border-slate-700 text-xs z-50 no-print"
            >
              <span className="text-[11px] font-bold text-amber-400 border-r border-slate-700 pr-1.5">Table Tools:</span>
              <button
                onClick={() => editor.chain().focus().addRowAfter().run()}
                className="px-2 py-0.5 bg-slate-800 hover:bg-emerald-900 text-emerald-300 rounded font-semibold text-[11px] transition-colors"
                title="Add Row Below"
              >
                + Row
              </button>
              <button
                onClick={() => editor.chain().focus().addColumnAfter().run()}
                className="px-2 py-0.5 bg-slate-800 hover:bg-blue-900 text-blue-300 rounded font-semibold text-[11px] transition-colors"
                title="Add Column Right"
              >
                + Col
              </button>
              <div className="w-[1px] h-3.5 bg-slate-700"></div>
              <button
                onClick={() => editor.chain().focus().deleteRow().run()}
                className="px-2 py-0.5 bg-slate-800 hover:bg-red-950 text-red-300 rounded font-semibold text-[11px] transition-colors"
                title="Delete Current Row"
              >
                - Row
              </button>
              <button
                onClick={() => editor.chain().focus().deleteColumn().run()}
                className="px-2 py-0.5 bg-slate-800 hover:bg-red-950 text-red-300 rounded font-semibold text-[11px] transition-colors"
                title="Delete Current Column"
              >
                - Col
              </button>
              <div className="w-[1px] h-3.5 bg-slate-700"></div>
              <button
                onClick={() => editor.chain().focus().deleteTable().run()}
                className="px-2 py-0.5 bg-red-700 hover:bg-red-800 text-white rounded font-bold text-[11px] transition-colors"
                title="Delete Entire Table"
              >
                Delete Table
              </button>
            </BubbleMenu>
          )}

          {/* Floating Bubble Formatting Toolbar */}
          {editor && (
            <BubbleMenu 
              editor={editor} 
              shouldShow={({ editor }) => !editor.isActive('table') && !editor.state.selection.empty}
              tippyOptions={{ duration: 100 }}
              className="bg-gray-900 text-white rounded-lg shadow-xl px-2 py-1 flex items-center gap-1 border border-gray-700 text-xs z-50"
            >
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-1 hover:bg-gray-800 rounded ${editor.isActive('bold') ? 'text-[#046a38] font-bold' : 'text-gray-300'}`}
              >
                <Bold className="w-3.5 h-3.5" />
              </button>
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`p-1 hover:bg-gray-800 rounded ${editor.isActive('italic') ? 'text-[#046a38]' : 'text-gray-300'}`}
              >
                <Italic className="w-3.5 h-3.5" />
              </button>
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={`p-1 hover:bg-gray-800 rounded ${editor.isActive('underline') ? 'text-[#046a38]' : 'text-gray-300'}`}
              >
                <UnderlineIcon className="w-3.5 h-3.5" />
              </button>
              <div className="w-[1px] h-3 bg-gray-700 mx-1"></div>
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                className="p-1 hover:bg-gray-800 rounded text-gray-300"
              >
                <AlignRight className="w-3.5 h-3.5" />
              </button>
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                className="p-1 hover:bg-gray-800 rounded text-gray-300"
              >
                <AlignCenter className="w-3.5 h-3.5" />
              </button>
              <button
                onMouseDown={(e) => e.preventDefault()}
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
            className="h-full min-h-[950px] lisan-dawat-text leading-relaxed text-gray-900 focus:outline-none"
          />
        </div>
      </div>

    </div>
  );
}

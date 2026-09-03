import React, { useState, useEffect, useRef, useCallback } from 'react';
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

const CustomImage = Image.extend({
  inline() {
    return true;
  },
  group() {
    return 'inline';
  },
  addAttributes() {
    return {
      ...this.parent?.(),
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
      width: {
        default: '40%',
        renderHTML: (attributes) => {
          if (!attributes.width) return {};
          return {
            width: attributes.width,
            style: `width: ${attributes.width}; max-width: 100%; height: auto;`,
          };
        },
        parseHTML: (element) => element.getAttribute('width') || element.style.width || '40%',
      },
      class: {
        default: 'align-left',
        renderHTML: (attributes) => {
          if (!attributes.class) return {};
          return {
            class: attributes.class,
          };
        },
        parseHTML: (element) => element.getAttribute('class') || 'align-left',
      },
      style: {
        default: null,
        renderHTML: (attributes) => {
          if (!attributes.style) return {};
          return {
            style: attributes.style,
          };
        },
        parseHTML: (element) => element.getAttribute('style'),
      },
    };
  },
});

const CustomTable = Table.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      dir: {
        default: 'rtl',
        parseHTML: (element) => element.getAttribute('dir') || 'rtl',
        renderHTML: (attributes) => {
          const dir = attributes.dir || 'rtl';
          return {
            dir: dir,
            class: dir === 'ltr' ? 'ltr-table' : 'rtl-table',
            style: `direction: ${dir} !important; width: 100%; border-collapse: collapse;`,
          };
        },
      },
    };
  },
});

export const PAGE_CONFIG = {
  A4: { name: 'A4', width: 794, height: 1123, label: 'A4 (210 × 297 mm)' },
  Letter: { name: 'Letter', width: 816, height: 1056, label: 'Letter (8.5 × 11 in)' },
  Legal: { name: 'Legal', width: 816, height: 1344, label: 'Legal (8.5 × 14 in)' },
  A5: { name: 'A5', width: 559, height: 794, label: 'A5 (148 × 210 mm)' },
};

export default function A4EditorCanvas({
  content,
  onContentChange,
  watermark,
  margins,
  orientation,
  pageSize = 'A4',
  onPageCountChange,
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

  const selectedPage = PAGE_CONFIG[pageSize] || PAGE_CONFIG.A4 || { width: 794, height: 1123 };
  const isLandscape = orientation === 'landscape';
  const pagePxWidth = isLandscape ? (selectedPage.height || 1123) : (selectedPage.width || 794);
  const pagePxHeight = isLandscape ? (selectedPage.width || 794) : (selectedPage.height || 1123);

  const paperRef = useRef(null);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const calculatePages = () => {
      if (!paperRef.current) return;
      const editorDom = paperRef.current.querySelector('.ProseMirror');
      if (!editorDom) return;

      const innerHeight = editorDom.scrollHeight || editorDom.clientHeight || pagePxHeight;
      const pages = Math.max(1, Math.min(50, Math.ceil((innerHeight + 80) / Math.max(100, pagePxHeight))));

      setTotalPages((prev) => {
        if (prev !== pages && Number.isFinite(pages)) {
          if (typeof onPageCountChange === 'function') {
            try {
              onPageCountChange(pages);
            } catch (err) {
              console.warn('Failed to update page count', err);
            }
          }
          return pages;
        }
        return prev;
      });
    };

    const timer = setTimeout(calculatePages, 80);
    return () => clearTimeout(timer);
  }, [content, orientation, pageSize, margins, pagePxHeight, onPageCountChange]);

  const validPages = (Number.isFinite(totalPages) && totalPages >= 1) ? Math.min(Math.floor(totalPages), 50) : 1;

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
      CustomTable.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      CustomImage,
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

  useEffect(() => {
    if (editor && setEditorInstance) {
      setEditorInstance(editor);
    }
  }, [editor, setEditorInstance]);

  // 60FPS Ultra-Smooth Interactive Direct Drag Resize (Mouse & Touch)
  useEffect(() => {
    if (!editor) return;

    let isDragging = false;
    let startX = 0;
    let startWidth = 0;
    let targetImg = null;
    let currentPercent = '50%';

    const handleStart = (clientX, clientY, target) => {
      const img = target.closest('.ProseMirror img');
      if (!img) return false;

      const rect = img.getBoundingClientRect();
      const clickX = clientX - rect.left;
      const clickY = clientY - rect.top;

      // Allow dragging anywhere on selected image or bottom-right corner
      if (img.classList.contains('ProseMirror-selectednode') || (clickX >= rect.width - 50 && clickY >= rect.height - 50)) {
        isDragging = true;
        startX = clientX;
        startWidth = rect.width;
        targetImg = img;
        document.body.style.cursor = 'nwse-resize';
        return true;
      }
      return false;
    };

    const handleMouseDown = (e) => {
      if (handleStart(e.clientX, e.clientY, e.target)) {
        e.preventDefault();
      }
    };

    const handleTouchStart = (e) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        if (handleStart(touch.clientX, touch.clientY, e.target)) {
          e.preventDefault();
        }
      }
    };

    const handleMove = (clientX) => {
      if (!isDragging || !targetImg) return;

      const paper = document.getElementById('letter-paper-canvas');
      const paperWidth = paper ? paper.clientWidth - 100 : 700;
      const deltaX = clientX - startX;
      const newPxWidth = Math.max(60, Math.min(paperWidth, startWidth + deltaX));
      currentPercent = Math.round((newPxWidth / paperWidth) * 100) + '%';

      // 60FPS Direct GPU-accelerated DOM mutation
      targetImg.style.width = currentPercent;
      targetImg.setAttribute('width', currentPercent);
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      handleMove(e.clientX);
    };

    const handleTouchMove = (e) => {
      if (!isDragging || e.touches.length === 0) return;
      e.preventDefault();
      handleMove(e.touches[0].clientX);
    };

    const handleEnd = () => {
      if (isDragging) {
        isDragging = false;
        if (targetImg) {
          editor.chain().focus().updateAttributes('image', {
            width: currentPercent,
            style: `width: ${currentPercent}; max-width: 100%; height: auto;`
          }).run();
        }
        targetImg = null;
        document.body.style.cursor = '';
      }
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleEnd);

    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleEnd);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEnd);

      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [editor]);

  return (
    <div className={`flex-1 bg-[#e8ecef] overflow-auto relative flex flex-col items-center py-6 px-4 no-print select-text ${textDirection === 'rtl' ? 'rtl-editor' : 'ltr-editor'}`}>
      
      {/* Top Horizontal Ruler (Hidden on small mobile) */}
      <div 
        className="hidden sm:flex w-full h-6 bg-white border border-gray-300 mb-2 items-center px-16 text-[10px] text-gray-500 justify-between select-none shadow-xs rounded-t-sm"
        style={{ maxWidth: `${pagePxWidth}px` }}
        dir={textDirection}
      >
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

      {/* Paper Container with Zoom Scaling */}
      <div 
        className="w-full transition-all origin-top duration-150 ease-out flex justify-center"
        style={{ 
          maxWidth: `${pagePxWidth}px`,
          transform: `scale(${zoomLevel / 100})` 
        }}
      >
        <div 
          className="relative w-full"
          style={{ 
            width: `${pagePxWidth}px`,
            maxWidth: `${pagePxWidth}px`,
          }}
        >
          {/* Layer 1: Visual Multi-Page Separation Breaks (Isolated React Overlay) */}
          <div className="absolute inset-0 pointer-events-none select-none z-20 no-print overflow-hidden">
            {validPages > 1 && Array.from({ length: validPages - 1 }).map((_, idx) => {
              const pageNum = idx + 1;
              const topOffset = pageNum * pagePxHeight;
              return (
                <div
                  key={pageNum}
                  className="absolute left-0 right-0 flex flex-col items-center"
                  style={{ top: `${topOffset}px` }}
                >
                  <div className="w-full h-8 bg-[#e8ecef] border-y border-gray-300 shadow-inner flex items-center justify-between px-6">
                    <span className="text-[10px] font-bold text-gray-500 font-mono tracking-wider">
                      ─── End of Page {pageNum} ───
                    </span>
                    <span className="text-[10px] font-bold bg-white text-gray-700 px-2.5 py-0.5 rounded-full border border-gray-300 shadow-2xs">
                      📄 Page {pageNum + 1} of {validPages} ({pageSize})
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Layer 2: Isolated Watermark */}
          {watermark && (
            <div className="watermark-text pointer-events-none select-none z-10">
              {watermark}
            </div>
          )}

          {/* Layer 3: Main Editor Paper Canvas (Contains ONLY EditorContent & Tiptap Menus) */}
          <div 
            ref={paperRef}
            id="letter-paper-canvas"
            dir={textDirection}
            className={`a4-paper paper-margin-guide ${marginPaddingMap[margins] || 'p-16'} transition-all relative overflow-hidden`}
            style={{ 
              width: `${pagePxWidth}px`,
              minHeight: `${validPages * pagePxHeight}px`,
              backgroundColor: paperColor || '#ffffff' 
            }}
          >
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
                <button
                  onClick={() => {
                    const currentDir = editor.getAttributes('table').dir || 'rtl';
                    const nextDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
                    editor.chain().focus().updateAttributes('table', { dir: nextDir }).run();
                  }}
                  className="px-2 py-0.5 bg-slate-800 hover:bg-amber-900 text-amber-300 rounded font-semibold text-[11px] transition-colors"
                  title="Flip Table Direction (Right-to-Left / Left-to-Right)"
                >
                  ⇄ Flip RTL/LTR
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

          {/* Floating Image Action Toolbar */}
          {editor && (
            <BubbleMenu
              editor={editor}
              shouldShow={({ editor }) => editor.isActive('image')}
              tippyOptions={{ duration: 100, placement: 'top', interactive: true, hideOnClick: false }}
              className="bg-slate-900 text-white rounded-xl shadow-2xl p-2.5 flex flex-col gap-2 border border-slate-700 text-xs z-50 no-print"
            >
              {/* Row 1: Text Wrapping & Alignment */}
              <div className="flex items-center gap-1.5 border-b border-slate-800 pb-2">
                <span className="text-[11px] font-bold text-amber-400 border-r border-slate-700 pr-1.5">Alignment:</span>
                <button
                  onClick={() => editor.chain().focus().updateAttributes('image', { class: 'align-left' }).run()}
                  className={`px-2 py-0.5 rounded font-semibold text-[11px] transition-colors ${
                    editor.getAttributes('image').class === 'align-left' ? 'bg-blue-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-blue-300'
                  }`}
                  title="Wrap Text Right (Float Left)"
                >
                  Wrap Left
                </button>
                <button
                  onClick={() => editor.chain().focus().updateAttributes('image', { class: 'align-center' }).run()}
                  className={`px-2 py-0.5 rounded font-semibold text-[11px] transition-colors ${
                    editor.getAttributes('image').class === 'align-center' || !editor.getAttributes('image').class ? 'bg-blue-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-blue-300'
                  }`}
                  title="Center Inline"
                >
                  Center
                </button>
                <button
                  onClick={() => editor.chain().focus().updateAttributes('image', { class: 'align-right' }).run()}
                  className={`px-2 py-0.5 rounded font-semibold text-[11px] transition-colors ${
                    editor.getAttributes('image').class === 'align-right' ? 'bg-blue-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-blue-300'
                  }`}
                  title="Wrap Text Left (Float Right)"
                >
                  Wrap Right
                </button>

                <div className="w-[1px] h-3.5 bg-slate-700 mx-1"></div>

                <button
                  onClick={() => editor.chain().focus().deleteSelection().run()}
                  className="px-2 py-0.5 bg-red-700 hover:bg-red-800 text-white rounded font-bold text-[11px] transition-colors"
                  title="Delete Image"
                >
                  Delete
                </button>
              </div>

              {/* Row 2: Live Smooth Width Range Slider & Width Presets */}
              <div className="flex items-center gap-2 pt-0.5">
                <span className="text-[11px] font-bold text-slate-400">Width:</span>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="1"
                  defaultValue={parseInt(editor.getAttributes('image').width || '50', 10)}
                  onInput={(e) => {
                    const val = e.target.value + '%';
                    const imgEl = document.querySelector('.ProseMirror img.ProseMirror-selectednode');
                    if (imgEl) {
                      imgEl.style.width = val;
                      imgEl.setAttribute('width', val);
                    }
                  }}
                  onChange={(e) => {
                    const newWidth = e.target.value + '%';
                    editor.chain().focus().updateAttributes('image', { 
                      width: newWidth,
                      style: `width: ${newWidth}; max-width: 100%; height: auto;`
                    }).run();
                  }}
                  className="w-28 accent-blue-500 cursor-pointer"
                />
                <span className="text-[11px] font-mono text-amber-300 w-10">{editor.getAttributes('image').width || '50%'}</span>

                <div className="flex items-center gap-1 border-l border-slate-700 pl-2">
                  {['25%', '50%', '75%', '100%'].map((val) => (
                    <button
                      key={val}
                      onClick={() => editor.chain().focus().updateAttributes('image', { 
                        width: val,
                        style: `width: ${val}; max-width: 100%; height: auto;`
                      }).run()}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                        editor.getAttributes('image').width === val ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            </BubbleMenu>
          )}

          {/* Floating Bubble Formatting Toolbar */}
          {editor && (
            <BubbleMenu 
              editor={editor} 
              shouldShow={({ editor }) => !editor.isActive('table') && !editor.isActive('image') && !editor.state.selection.empty}
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

  </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import {
  Bold, Italic, Underline, Strikethrough, Subscript, Superscript,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Indent, Outdent,
  Highlighter, Palette, Undo2, Redo2,
  Table, Calendar, FileText, Stamp, Image,
  Printer, Download, Plus, Layout, Type, Sparkles, Keyboard, Upload, Settings,
  AArrowUp, AArrowDown, Eraser, ChevronDown, Check, Minus
} from 'lucide-react';

export default function Ribbon({
  editor,
  watermark,
  setWatermark,
  margins,
  setMargins,
  orientation,
  setOrientation,
  pageSize = 'A4',
  setPageSize,
  paperColor,
  setPaperColor,
  textDirection,
  setTextDirection,
  allAvailableFonts = [],
  activeFontValues = [],
  onOpenTemplateModal,
  onOpenFontUploadModal,
  onOpenFontManagerModal,
  onExportPDF,
  onExportDOCX,
  onImportDOCX,
  onPrint,
  onNewLetter,
  onInsertDate,
  onInsertBlock,
  onToggleArabicKeyboard
}) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [showWatermarkPopover, setShowWatermarkPopover] = useState(false);
  const [customWatermarkInput, setCustomWatermarkInput] = useState(watermark || '');
  const [fontSizeVal, setFontSizeVal] = useState(12);

  const colorPickerRef = useRef(null);
  const highlightPickerRef = useRef(null);
  const watermarkPopoverRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(e.target)) {
        setShowColorPicker(false);
      }
      if (highlightPickerRef.current && !highlightPickerRef.current.contains(e.target)) {
        setShowHighlightPicker(false);
      }
      if (watermarkPopoverRef.current && !watermarkPopoverRef.current.contains(e.target)) {
        setShowWatermarkPopover(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!editor) return null;

  // Filter fonts to only show active ones (strictly LSD fonts)
  const filteredFonts = allAvailableFonts.filter((f) => activeFontValues.includes(f.value));
  const visibleFonts = filteredFonts.length > 0 ? filteredFonts : allAvailableFonts;

  const fontSizes = [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 30, 36, 48, 60, 72];

  const colorSwatches = [
    '#000000', '#434343', '#666666', '#999999', '#b7b7b7', '#cccccc', '#d9d9d9', '#efefef', '#f3f3f3', '#ffffff',
    '#980000', '#ff0000', '#ff9900', '#ffff00', '#00ff00', '#00ffff', '#4a86e8', '#0000ff', '#9900ff', '#ff00ff',
    '#e6b8af', '#f4cccc', '#fce5cd', '#fff2cc', '#d9ead3', '#d0e0e3', '#c9daf8', '#cfe2f3', '#d9d2e9', '#ead1dc',
    '#046a38', '#106ebe', '#107c41', '#8a001a', '#b4009e', '#323130', '#605e5c', '#0078d4', '#d13438', '#ffaa44'
  ];

  const highlightSwatches = [
    { name: 'Yellow', color: '#fff59d' },
    { name: 'Green', color: '#c8e6c9' },
    { name: 'Cyan', color: '#b3e5fc' },
    { name: 'Pink', color: '#f8bbd0' },
    { name: 'Orange', color: '#ffe0b2' },
    { name: 'Purple', color: '#e1bee7' },
    { name: 'Red', color: '#ffcdd2' },
    { name: 'Lime', color: '#e6ee9c' }
  ];

  const changeFontSize = (delta) => {
    const nextSize = Math.max(6, Math.min(96, fontSizeVal + delta));
    setFontSizeVal(nextSize);
    editor.chain().focus().setFontSize(`${nextSize}pt`).run();
  };

  return (
    <div className="select-none z-30 relative no-print bg-[#f9fbfd] py-1.5 border-b border-[#dadce0]/80" dir="ltr">
      {/* Google Docs Floating Rounded Action Toolbar */}
      <div className="bg-[#edf2fa] rounded-full mx-2 sm:mx-4 px-3 py-1 flex items-center flex-wrap sm:flex-nowrap gap-1 sm:gap-1.5 shadow-xs border border-[#dadce0]/60 overflow-visible text-xs text-gray-700">
        
        {/* Undo / Redo */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-1.5 hover:bg-black/10 rounded-full disabled:opacity-30 transition-colors text-gray-700"
          title="Undo (Ctrl+Z)"
        >
          <Undo2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-1.5 hover:bg-black/10 rounded-full disabled:opacity-30 transition-colors text-gray-700"
          title="Redo (Ctrl+Y)"
        >
          <Redo2 className="w-4 h-4" />
        </button>

        {/* Print */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={onPrint}
          className="p-1.5 hover:bg-black/10 rounded-full transition-colors text-gray-700"
          title="Print (Ctrl+P)"
        >
          <Printer className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-4 bg-gray-300 mx-0.5"></div>

        {/* Heading / Style Selector */}
        <select
          value={
            editor.isActive('heading', { level: 1 }) ? 'h1' :
            editor.isActive('heading', { level: 2 }) ? 'h2' :
            editor.isActive('heading', { level: 3 }) ? 'h3' : 'p'
          }
          onChange={(e) => {
            const val = e.target.value;
            if (val === 'p') editor.chain().focus().setParagraph().run();
            else if (val === 'h1') editor.chain().focus().toggleHeading({ level: 1 }).run();
            else if (val === 'h2') editor.chain().focus().toggleHeading({ level: 2 }).run();
            else if (val === 'h3') editor.chain().focus().toggleHeading({ level: 3 }).run();
          }}
          className="bg-transparent hover:bg-black/5 text-gray-800 font-medium px-2 py-1 rounded cursor-pointer focus:outline-none text-xs border border-transparent hover:border-gray-300"
        >
          <option value="p">Normal text</option>
          <option value="h1">Title / Heading 1</option>
          <option value="h2">Subtitle / Heading 2</option>
          <option value="h3">Heading 3</option>
        </select>

        <div className="w-[1px] h-4 bg-gray-300 mx-0.5"></div>

        {/* LSD Font Family Selector (Strictly LSD Fonts Only) */}
        <div className="flex items-center">
          <select
            value={editor.getAttributes('textStyle').fontFamily || ''}
            onChange={(e) => {
              const val = e.target.value;
              editor.chain().focus().setFontFamily(val).run();
            }}
            className="bg-transparent hover:bg-black/5 text-gray-900 font-semibold px-2 py-1 rounded cursor-pointer focus:outline-none text-xs max-w-[170px] border border-transparent hover:border-gray-300"
            title="Lisan al Dawat Typography Fonts"
          >
            <option value="" disabled>Choose Font</option>
            {visibleFonts.map((font) => (
              <option key={font.value} value={font.value}>
                {font.name}
              </option>
            ))}
          </select>
        </div>

        <div className="w-[1px] h-4 bg-gray-300 mx-0.5"></div>

        {/* Font Size with Stepper (- / +) */}
        <div className="flex items-center bg-white/70 rounded-md border border-gray-300 px-1 py-0.5">
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => changeFontSize(-1)}
            className="p-1 hover:bg-gray-200 rounded text-gray-700"
            title="Decrease font size (Ctrl+Shift+,)"
          >
            <Minus className="w-3 h-3" />
          </button>
          <select
            value={fontSizeVal}
            onChange={(e) => {
              const sz = parseInt(e.target.value, 10);
              setFontSizeVal(sz);
              editor.chain().focus().setFontSize(`${sz}pt`).run();
            }}
            className="bg-transparent font-medium text-xs text-center w-9 cursor-pointer focus:outline-none"
          >
            {fontSizes.map((sz) => (
              <option key={sz} value={sz}>{sz}</option>
            ))}
          </select>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => changeFontSize(1)}
            className="p-1 hover:bg-gray-200 rounded text-gray-700"
            title="Increase font size (Ctrl+Shift+.)"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>

        <div className="w-[1px] h-4 bg-gray-300 mx-0.5"></div>

        {/* Bold, Italic, Underline, Strike */}
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-1.5 rounded transition-colors ${editor.isActive('bold') ? 'bg-[#d3e3fd] text-[#041e49] font-bold' : 'hover:bg-black/10 text-gray-700'}`}
            title="Bold (Ctrl+B)"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-1.5 rounded transition-colors ${editor.isActive('italic') ? 'bg-[#d3e3fd] text-[#041e49]' : 'hover:bg-black/10 text-gray-700'}`}
            title="Italic (Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-1.5 rounded transition-colors ${editor.isActive('underline') ? 'bg-[#d3e3fd] text-[#041e49]' : 'hover:bg-black/10 text-gray-700'}`}
            title="Underline (Ctrl+U)"
          >
            <Underline className="w-4 h-4" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`p-1.5 rounded transition-colors ${editor.isActive('strike') ? 'bg-[#d3e3fd] text-[#041e49]' : 'hover:bg-black/10 text-gray-700'}`}
            title="Strikethrough"
          >
            <Strikethrough className="w-4 h-4" />
          </button>
        </div>

        {/* Text Color Popover */}
        <div ref={colorPickerRef} className="relative">
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="p-1.5 hover:bg-black/10 rounded flex items-center gap-0.5 text-gray-700"
            title="Text color"
          >
            <div className="flex flex-col items-center">
              <span className="font-serif font-bold text-xs leading-none">A</span>
              <div className="w-3.5 h-1 bg-black mt-0.5 rounded-full"></div>
            </div>
            <ChevronDown className="w-2.5 h-2.5 text-gray-500" />
          </button>

          {showColorPicker && (
            <div className="absolute top-10 left-0 bg-white border border-gray-300 rounded-xl shadow-2xl p-3 z-[100] flex flex-col gap-2 min-w-[260px]">
              <div className="flex items-center justify-between border-b border-gray-100 pb-1.5">
                <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">Text Color</span>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    editor.chain().focus().unsetColor().run();
                    setShowColorPicker(false);
                  }}
                  className="text-[10px] text-blue-600 hover:underline font-semibold"
                >
                  Reset (Black)
                </button>
              </div>
              <div className="grid grid-cols-10 gap-1.5">
                {colorSwatches.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      editor.chain().focus().setColor(color).run();
                      setShowColorPicker(false);
                    }}
                    className="w-5 h-5 rounded-full border border-gray-300 hover:scale-125 transition-transform shadow-2xs cursor-pointer"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Highlight Color Popover */}
        <div ref={highlightPickerRef} className="relative">
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setShowHighlightPicker(!showHighlightPicker)}
            className={`p-1.5 rounded flex items-center gap-0.5 transition-colors ${
              editor.isActive('highlight') ? 'bg-amber-200 text-amber-950 font-bold' : 'hover:bg-black/10 text-gray-700'
            }`}
            title="Highlight color"
          >
            <Highlighter className="w-4 h-4 text-amber-500" />
            <ChevronDown className="w-2.5 h-2.5 text-gray-500" />
          </button>

          {showHighlightPicker && (
            <div className="absolute top-10 left-0 bg-white border border-gray-300 rounded-xl shadow-2xl p-2.5 z-[100] flex flex-col gap-2 min-w-[160px]">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Highlight Color</span>
              <div className="grid grid-cols-4 gap-1.5">
                {highlightSwatches.map((item) => (
                  <button
                    key={item.color}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      editor.chain().focus().setHighlight({ color: item.color }).run();
                      setShowHighlightPicker(false);
                    }}
                    className="w-6 h-6 rounded-full border border-gray-300 hover:scale-115 transition-transform shadow-2xs"
                    style={{ backgroundColor: item.color }}
                    title={item.name}
                  />
                ))}
              </div>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  editor.chain().focus().unsetHighlight().run();
                  setShowHighlightPicker(false);
                }}
                className="text-[11px] text-red-600 hover:bg-red-50 py-1 px-2 rounded text-left font-semibold border-t border-gray-100"
              >
                ✕ Clear highlight
              </button>
            </div>
          )}
        </div>

        <div className="w-[1px] h-4 bg-gray-300 mx-0.5"></div>

        {/* Table & Bismillah Header Shortcuts */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
          className="p-1.5 hover:bg-black/10 rounded transition-colors text-gray-700 flex items-center gap-1"
          title="Insert Table (3 × 3)"
        >
          <Table className="w-4 h-4 text-blue-700" />
        </button>

        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => onInsertBlock?.('bismillah')}
          className="px-2 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-950 font-bold rounded-full transition-colors flex items-center gap-1 text-[11px]"
          title="Insert Bismillah Calligraphy Header"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
          <span>Bismillah</span>
        </button>

        <div className="w-[1px] h-4 bg-gray-300 mx-0.5"></div>

        {/* Text Alignment */}
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={`p-1.5 rounded ${editor.isActive({ textAlign: 'left' }) ? 'bg-[#d3e3fd] text-[#041e49]' : 'hover:bg-black/10 text-gray-700'}`}
            title="Align left"
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={`p-1.5 rounded ${editor.isActive({ textAlign: 'center' }) ? 'bg-[#d3e3fd] text-[#041e49]' : 'hover:bg-black/10 text-gray-700'}`}
            title="Align center"
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={`p-1.5 rounded ${editor.isActive({ textAlign: 'right' }) ? 'bg-[#d3e3fd] text-[#041e49]' : 'hover:bg-black/10 text-gray-700'}`}
            title="Align right"
          >
            <AlignRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            className={`p-1.5 rounded ${editor.isActive({ textAlign: 'justify' }) ? 'bg-[#d3e3fd] text-[#041e49]' : 'hover:bg-black/10 text-gray-700'}`}
            title="Justify"
          >
            <AlignJustify className="w-4 h-4" />
          </button>
        </div>

        <div className="w-[1px] h-4 bg-gray-300 mx-0.5"></div>

        {/* Text Direction (LTR / RTL) */}
        <div className="flex items-center bg-white/70 p-0.5 rounded border border-gray-300">
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setTextDirection('ltr')}
            className={`px-2 py-0.5 rounded text-xs font-bold transition-all ${
              textDirection === 'ltr' ? 'bg-[#4285F4] text-white shadow-2xs' : 'text-gray-600 hover:text-gray-900'
            }`}
            title="Left-to-Right Direction (LTR)"
          >
            &gt;&para; LTR
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setTextDirection('rtl')}
            className={`px-2 py-0.5 rounded text-xs font-bold transition-all ${
              textDirection === 'rtl' ? 'bg-[#046a38] text-white shadow-2xs' : 'text-gray-600 hover:text-gray-900'
            }`}
            title="Right-to-Left Arabic / LSD Direction (RTL)"
          >
            &para;&lt; RTL
          </button>
        </div>

        <div className="w-[1px] h-4 bg-gray-300 mx-0.5"></div>

        {/* Bullet List & Numbered List */}
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-1.5 rounded ${editor.isActive('bulletList') ? 'bg-[#d3e3fd] text-[#041e49]' : 'hover:bg-black/10 text-gray-700'}`}
            title="Bulleted list"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-1.5 rounded ${editor.isActive('orderedList') ? 'bg-[#d3e3fd] text-[#041e49]' : 'hover:bg-black/10 text-gray-700'}`}
            title="Numbered list"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
        </div>

        {/* Indent / Outdent */}
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().liftListItem('listItem').run()}
            className="p-1.5 hover:bg-black/10 rounded text-gray-700"
            title="Decrease indent"
          >
            <Outdent className="w-4 h-4" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().sinkListItem('listItem').run()}
            className="p-1.5 hover:bg-black/10 rounded text-gray-700"
            title="Increase indent"
          >
            <Indent className="w-4 h-4" />
          </button>
        </div>

        <div className="w-[1px] h-4 bg-gray-300 mx-0.5"></div>

        {/* Watermark Tool Popover */}
        <div ref={watermarkPopoverRef} className="relative">
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setShowWatermarkPopover(!showWatermarkPopover)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
              watermark ? 'bg-red-100 text-red-900 border border-red-300 font-bold' : 'hover:bg-black/10 text-gray-700'
            }`}
            title="Watermark Settings"
          >
            <Stamp className="w-3.5 h-3.5 text-red-600" />
            <span className="max-w-[70px] truncate">{watermark || 'Watermark'}</span>
            <ChevronDown className="w-2.5 h-2.5 text-gray-500" />
          </button>

          {showWatermarkPopover && (
            <div className="absolute top-10 right-0 bg-white border border-gray-300 rounded-xl shadow-2xl p-3 z-[100] w-72 max-w-[90vw] flex flex-col gap-2.5">
              <div className="flex items-center justify-between border-b border-gray-100 pb-1.5">
                <span className="font-bold text-gray-900 text-xs flex items-center gap-1.5">
                  <Stamp className="w-3.5 h-3.5 text-red-600" />
                  <span>Custom Watermark</span>
                </span>
                {watermark && (
                  <button
                    type="button"
                    onClick={() => {
                      setWatermark('');
                      setCustomWatermarkInput('');
                      setShowWatermarkPopover(false);
                    }}
                    className="text-[10px] text-red-600 hover:underline font-bold"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">Custom text:</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    placeholder="e.g. Al-Jamea, CONFIDENTIAL..."
                    value={customWatermarkInput}
                    onChange={(e) => setCustomWatermarkInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && customWatermarkInput.trim()) {
                        setWatermark(customWatermarkInput.trim());
                        setShowWatermarkPopover(false);
                      }
                    }}
                    className="flex-1 px-2.5 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customWatermarkInput.trim()) {
                        setWatermark(customWatermarkInput.trim());
                        setShowWatermarkPopover(false);
                      }
                    }}
                    className="bg-[#1a73e8] text-white px-2.5 py-1 rounded font-bold text-xs"
                  >
                    Apply
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-1 pt-1 border-t border-gray-100">
                {['DRAFT', 'CONFIDENTIAL', 'URGENT', 'مسودة', 'سري للغاية'].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => {
                      setWatermark(val);
                      setCustomWatermarkInput(val);
                      setShowWatermarkPopover(false);
                    }}
                    className="px-2 py-1 rounded text-[11px] font-medium bg-gray-50 hover:bg-gray-100 border border-gray-200 text-left truncate"
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Arabic Keyboard Toggle */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={onToggleArabicKeyboard}
          className="p-1.5 hover:bg-black/10 rounded transition-colors text-emerald-800 flex items-center gap-1 bg-emerald-50 px-2 border border-emerald-300 font-bold"
          title="Toggle Lisan al Dawat Virtual Keyboard"
        >
          <Keyboard className="w-4 h-4 text-emerald-700" />
          <span className="hidden lg:inline text-[11px]">Keyboard</span>
        </button>

        {/* Clear Formatting */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
          className="p-1.5 hover:bg-black/10 rounded text-gray-700"
          title="Clear formatting (Ctrl+\)"
        >
          <Eraser className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
}

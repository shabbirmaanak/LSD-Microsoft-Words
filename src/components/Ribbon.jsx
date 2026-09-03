import React, { useState } from 'react';
import {
  Bold, Italic, Underline, Strikethrough, Subscript, Superscript,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Indent, Outdent,
  Highlighter, Palette, RotateCcw, RotateCw,
  Table, Calendar, User, FileText, Stamp, Image,
  Printer, Download, Plus, Layout, Type, Sparkles, Keyboard, Upload, Settings,
  AArrowUp, AArrowDown, Eraser, CaseUpper
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
  const [activeTab, setActiveTab] = useState('home');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);

  if (!editor) return null;

  // Filter fonts to only show active ones, fallback to allAvailableFonts if empty
  const filteredFonts = allAvailableFonts.filter((f) => activeFontValues.includes(f.value));
  const visibleFonts = filteredFonts.length > 0 ? filteredFonts : allAvailableFonts;

  const fontSizes = ['10pt', '11pt', '12pt', '14pt', '16pt', '18pt', '22pt', '26pt', '32pt', '40pt'];

  const colorSwatches = [
    '#000000', '#106ebe', '#046a38', '#d13438', '#b4009e', 
    '#323130', '#605e5c', '#0078d4', '#107c41', '#8a001a'
  ];

  const highlightSwatches = [
    { name: 'Yellow', color: '#fff59d' },
    { name: 'Green', color: '#c8e6c9' },
    { name: 'Cyan', color: '#b3e5fc' },
    { name: 'Pink', color: '#f8bbd0' },
    { name: 'Orange', color: '#ffe0b2' },
  ];

  return (
    <div className="select-none z-20 no-print" dir="ltr">

      {/* ==================== 1. MOBILE STACKED TOOLBAR CARD (Visible on Mobile < 768px) ==================== */}
      <div className="block md:hidden bg-white border-b border-gray-300 p-2.5 shadow-xs space-y-2 select-none text-xs">
        
        {/* Row 1: Font Selector + Size Selector + LTR/RTL Toggle + Keyboard */}
        <div className="flex items-center gap-1.5 justify-between">
          <select
            onChange={(e) => {
              const val = e.target.value;
              if (val === '__manage__') {
                onOpenFontManagerModal();
              } else if (val) {
                editor.chain().focus().setFontFamily(val).run();
              }
            }}
            className="bg-gray-50 border border-gray-300 rounded px-2 py-1 text-xs font-semibold text-gray-900 flex-1 min-w-[110px]"
            value={editor.getAttributes('textStyle').fontFamily || ''}
          >
            <option value="" disabled>Select Font</option>
            {visibleFonts.map((f) => (
              <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>
                {f.name}
              </option>
            ))}
            <option value="__manage__">⚙️ Manage Fonts...</option>
          </select>

          <select
            onChange={(e) => {
              editor.chain().focus().setFontSize(e.target.value).run();
            }}
            className="bg-gray-50 border border-gray-300 rounded px-1.5 py-1 text-xs font-semibold text-gray-900 w-16"
            defaultValue="12pt"
          >
            {fontSizes.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {/* LTR / RTL Direction Toggle */}
          <div className="flex items-center bg-gray-200/80 p-0.5 rounded border border-gray-300">
            <button
              onClick={() => { setTextDirection('ltr'); editor.chain().focus().setTextAlign('left').run(); }}
              className={`px-2 py-0.5 rounded text-xs font-mono font-bold transition-all ${
                textDirection === 'ltr' ? 'bg-[#106ebe] text-white shadow-xs' : 'text-gray-700 hover:bg-gray-100'
              }`}
              title="Left-to-Right"
            >
              ›¶
            </button>
            <button
              onClick={() => { setTextDirection('rtl'); editor.chain().focus().setTextAlign('right').run(); }}
              className={`px-2 py-0.5 rounded text-xs font-mono font-bold transition-all ${
                textDirection === 'rtl' ? 'bg-[#046a38] text-white shadow-xs' : 'text-gray-700 hover:bg-gray-100'
              }`}
              title="Right-to-Left (Lisan al Dawat / Arabic)"
            >
              ¶‹
            </button>
          </div>

          {/* On-Screen Keyboard Button */}
          <button
            onClick={onToggleArabicKeyboard}
            className="bg-emerald-700 hover:bg-emerald-800 text-white p-1.5 rounded transition-colors shadow-xs"
            title="Open Arabic / Lisan al Dawat Keyboard"
          >
            <Keyboard className="w-4 h-4 text-emerald-100" />
          </button>
        </div>

        {/* Row 2: Text Styles B I U S Palette Undo Redo */}
        <div className="flex items-center gap-1 justify-between border-t border-b border-gray-100 py-1">
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-1.5 rounded font-bold text-xs ${
                editor.isActive('bold') ? 'bg-blue-100 text-[#106ebe] font-bold border border-blue-300' : 'hover:bg-gray-100 text-gray-700'
              }`}
              title="Bold"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-1.5 rounded text-xs ${
                editor.isActive('italic') ? 'bg-blue-100 text-[#106ebe] border border-blue-300' : 'hover:bg-gray-100 text-gray-700'
              }`}
              title="Italic"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={`p-1.5 rounded text-xs ${
                editor.isActive('underline') ? 'bg-blue-100 text-[#106ebe] border border-blue-300' : 'hover:bg-gray-100 text-gray-700'
              }`}
              title="Underline"
            >
              <Underline className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={`p-1.5 rounded text-xs ${
                editor.isActive('strike') ? 'bg-blue-100 text-[#106ebe] border border-blue-300' : 'hover:bg-gray-100 text-gray-700'
              }`}
              title="Strikethrough"
            >
              <Strikethrough className="w-4 h-4" />
            </button>
            <div className="relative">
              <button
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="p-1.5 rounded text-xs hover:bg-gray-100 text-gray-700"
                title="Font Color"
              >
                <Palette className="w-4 h-4 text-blue-600" />
              </button>

              {showColorPicker && (
                <div className="absolute top-8 left-0 bg-white border border-gray-300 rounded-lg shadow-xl p-2 z-50 grid grid-cols-5 gap-1.5 w-36">
                  {colorSwatches.map((color) => (
                    <button
                      key={color}
                      onClick={() => {
                        editor.chain().focus().setColor(color).run();
                        setShowColorPicker(false);
                      }}
                      className="w-5 h-5 rounded border border-gray-300 hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => {
                  if (editor.isActive('highlight')) {
                    editor.chain().focus().unsetHighlight().run();
                  } else {
                    setShowHighlightPicker(!showHighlightPicker);
                  }
                }}
                className={`p-1.5 rounded text-xs transition-colors ${
                  editor.isActive('highlight') ? 'bg-amber-200 text-amber-950 font-bold border border-amber-400' : 'hover:bg-gray-100 text-gray-700'
                }`}
                title="Highlight Text"
              >
                <Highlighter className="w-4 h-4 text-amber-500" />
              </button>

              {showHighlightPicker && (
                <div className="absolute top-8 left-0 bg-white border border-gray-300 rounded-lg shadow-xl p-2 z-50 flex flex-col gap-1.5 w-36">
                  <span className="text-[10px] font-bold text-gray-500">Highlight</span>
                  <div className="flex items-center gap-1.5">
                    {highlightSwatches.map((item) => (
                      <button
                        key={item.color}
                        onClick={() => {
                          editor.chain().focus().setHighlight({ color: item.color }).run();
                          setShowHighlightPicker(false);
                        }}
                        className="w-5 h-5 rounded-full border border-gray-400 hover:scale-110 shadow-xs"
                        style={{ backgroundColor: item.color }}
                        title={item.name}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      editor.chain().focus().unsetHighlight().run();
                      setShowHighlightPicker(false);
                    }}
                    className="text-[10px] text-red-600 hover:bg-red-50 py-0.5 rounded text-left font-medium border-t border-gray-100"
                  >
                    Clear Highlight
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              className="p-1.5 rounded text-xs hover:bg-gray-100 disabled:opacity-30"
              title="Undo"
            >
              <RotateCcw className="w-4 h-4 text-gray-700" />
            </button>
            <button
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              className="p-1.5 rounded text-xs hover:bg-gray-100 disabled:opacity-30"
              title="Redo"
            >
              <RotateCw className="w-4 h-4 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Row 3: Lists & Alignments */}
        <div className="flex items-center gap-1 justify-between">
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-1.5 rounded ${
                editor.isActive('bulletList') ? 'bg-blue-100 text-[#106ebe]' : 'hover:bg-gray-100 text-gray-700'
              }`}
              title="Bullet List"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`p-1.5 rounded ${
                editor.isActive('orderedList') ? 'bg-blue-100 text-[#106ebe]' : 'hover:bg-gray-100 text-gray-700'
              }`}
              title="Numbered List"
            >
              <ListOrdered className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-0.5">
            <button
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              className={`p-1.5 rounded ${
                editor.isActive({ textAlign: 'left' }) ? 'bg-blue-100 text-[#106ebe]' : 'hover:bg-gray-100 text-gray-700'
              }`}
              title="Align Left"
            >
              <AlignLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              className={`p-1.5 rounded ${
                editor.isActive({ textAlign: 'center' }) ? 'bg-blue-100 text-[#106ebe]' : 'hover:bg-gray-100 text-gray-700'
              }`}
              title="Align Center"
            >
              <AlignCenter className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              className={`p-1.5 rounded ${
                editor.isActive({ textAlign: 'right' }) ? 'bg-blue-100 text-[#106ebe]' : 'hover:bg-gray-100 text-gray-700'
              }`}
              title="Align Right"
            >
              <AlignRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().setTextAlign('justify').run()}
              className={`p-1.5 rounded ${
                editor.isActive({ textAlign: 'justify' }) ? 'bg-blue-100 text-[#106ebe]' : 'hover:bg-gray-100 text-gray-700'
              }`}
              title="Justify"
            >
              <AlignJustify className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Hidden Image File Input */}
        <input
          type="file"
          id="image-upload-input"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (event) => {
                editor.chain().focus().setImage({ src: event.target.result }).run();
              };
              reader.readAsDataURL(file);
            }
          }}
        />

        {/* Row 4: Page Layout & Actions (Landscape, Print, PDF, Insert Image, Table) */}
        <div className="flex items-center gap-1.5 justify-between pt-1 border-t border-gray-100 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setOrientation(orientation === 'portrait' ? 'landscape' : 'portrait')}
            className={`px-2 py-1 rounded text-[11px] font-bold border transition-colors shadow-2xs ${
              orientation === 'landscape' ? 'bg-indigo-600 text-white border-indigo-700' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
            title="Toggle Page Orientation (Portrait / Landscape)"
          >
            {orientation === 'landscape' ? '📐 Landscape' : '📄 Portrait'}
          </button>

          <button
            onClick={() => document.getElementById('image-upload-input')?.click()}
            className="bg-purple-700 hover:bg-purple-800 text-white px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1 shadow-xs"
            title="Insert Image from device"
          >
            <Image className="w-3.5 h-3.5 text-purple-200" />
            <span>Image</span>
          </button>

          <button
            onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
            className="bg-indigo-700 hover:bg-indigo-800 text-white px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1 shadow-xs"
            title="Insert 3x3 Table"
          >
            <Table className="w-3.5 h-3.5 text-indigo-200" />
            <span>Table</span>
          </button>

          <button
            onClick={onExportDOCX}
            className="bg-[#106ebe] hover:bg-blue-800 text-white px-2 py-1 rounded text-[11px] font-bold flex items-center gap-1 shadow-xs"
            title="Download as Word Document (.docx)"
          >
            <FileText className="w-3.5 h-3.5 text-blue-200" />
            <span>.DOCX</span>
          </button>

          <button
            onClick={onExportPDF}
            className="bg-blue-700 hover:bg-blue-800 text-white px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1 shadow-xs"
            title="Export as PDF"
          >
            <Download className="w-3.5 h-3.5 text-blue-200" />
            <span>PDF</span>
          </button>

          <button
            onClick={onPrint}
            className="bg-gray-800 hover:bg-gray-900 text-white px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1 shadow-xs"
            title="Print Letter Document"
          >
            <Printer className="w-3.5 h-3.5 text-gray-200" />
            <span>Print</span>
          </button>

          <button
            onClick={() => onInsertBlock('bismillah')}
            className="bg-emerald-800 hover:bg-emerald-900 text-white px-2 py-1 rounded text-[10px] font-serif font-bold whitespace-nowrap shadow-xs"
          >
            بِسْمِ اللَّهِ
          </button>
        </div>
      </div>

      {/* ==================== 2. DESKTOP FULL RIBBON TAB (Visible on Desktop >= 768px) ==================== */}
      <div className="hidden md:block bg-[#f3f2f1] border-b border-gray-300">
        {/* Ribbon Navigation Tabs */}
        <div className="flex items-center px-4 bg-[#e1dfdd]/40 border-b border-gray-300/80 text-xs">
          <div className="flex items-center">
            {['file', 'home', 'insert', 'layout', 'templates'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 font-semibold uppercase tracking-wider transition-all border-b-2 ${
                  activeTab === tab
                    ? 'bg-white border-[#106ebe] text-[#106ebe] shadow-sm'
                    : 'border-transparent text-gray-700 hover:bg-gray-200/80 hover:text-gray-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Ribbon Content Panels */}
        <div className="p-2 px-4 flex items-center gap-4 min-h-[64px] overflow-x-auto text-xs">
          
          {/* HOME TAB */}
          {activeTab === 'home' && (
            <div className="flex items-center gap-3">
              {/* Undo / Redo group */}
              <div className="flex items-center gap-1 border-r border-gray-300 pr-3">
                <button
                  onClick={() => editor.chain().focus().undo().run()}
                  disabled={!editor.can().undo()}
                  className="p-1.5 hover:bg-gray-200 rounded disabled:opacity-30 transition-colors"
                  title="Undo (Ctrl+Z)"
                >
                  <RotateCcw className="w-4 h-4 text-gray-700" />
                </button>
                <button
                  onClick={() => editor.chain().focus().redo().run()}
                  disabled={!editor.can().redo()}
                  className="p-1.5 hover:bg-gray-200 rounded disabled:opacity-30 transition-colors"
                  title="Redo (Ctrl+Y)"
                >
                  <RotateCw className="w-4 h-4 text-gray-700" />
                </button>
              </div>

              {/* Font Family & Size Selector */}
              <div className="flex items-center gap-1 border-r border-gray-300 pr-3">
                <select
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '__manage__') {
                      onOpenFontManagerModal();
                    } else if (val) {
                      editor.chain().focus().setFontFamily(val).run();
                    }
                  }}
                  className="bg-white border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-600 font-semibold text-gray-900 min-w-[160px]"
                  value={editor.getAttributes('textStyle').fontFamily || ''}
                >
                  <option value="" disabled>Select Font</option>
                  {visibleFonts.map((f) => (
                    <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>
                      {f.name}
                    </option>
                  ))}
                  <option value="__manage__" className="font-bold text-blue-600 bg-blue-50">
                    ⚙️ Manage Font List...
                  </option>
                </select>

                <select
                  onChange={(e) => {
                    editor.chain().focus().setFontSize(e.target.value).run();
                  }}
                  className="bg-white border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-600 font-semibold text-gray-900"
                  defaultValue="12pt"
                >
                  {fontSizes.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Font Formatting: B I U S Sub Sup */}
              <div className="flex items-center gap-0.5 border-r border-gray-300 pr-3">
                <button
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  className={`p-1.5 rounded transition-colors ${
                    editor.isActive('bold') ? 'bg-blue-100 text-[#106ebe] font-bold border border-blue-300' : 'hover:bg-gray-200 text-gray-700'
                  }`}
                  title="Bold (Ctrl+B)"
                >
                  <Bold className="w-4 h-4" />
                </button>

                <button
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  className={`p-1.5 rounded transition-colors ${
                    editor.isActive('italic') ? 'bg-blue-100 text-[#106ebe] border border-blue-300' : 'hover:bg-gray-200 text-gray-700'
                  }`}
                  title="Italic (Ctrl+I)"
                >
                  <Italic className="w-4 h-4" />
                </button>

                <button
                  onClick={() => editor.chain().focus().toggleUnderline().run()}
                  className={`p-1.5 rounded transition-colors ${
                    editor.isActive('underline') ? 'bg-blue-100 text-[#106ebe] border border-blue-300' : 'hover:bg-gray-200 text-gray-700'
                  }`}
                  title="Underline (Ctrl+U)"
                >
                  <Underline className="w-4 h-4" />
                </button>

                <button
                  onClick={() => editor.chain().focus().toggleStrike().run()}
                  className={`p-1.5 rounded transition-colors ${
                    editor.isActive('strike') ? 'bg-blue-100 text-[#106ebe] border border-blue-300' : 'hover:bg-gray-200 text-gray-700'
                  }`}
                  title="Strikethrough"
                >
                  <Strikethrough className="w-4 h-4" />
                </button>

                <button
                  onClick={() => editor.chain().focus().toggleSubscript().run()}
                  className={`p-1.5 rounded transition-colors ${
                    editor.isActive('subscript') ? 'bg-blue-100 text-[#106ebe] border border-blue-300' : 'hover:bg-gray-200 text-gray-700'
                  }`}
                  title="Subscript"
                >
                  <Subscript className="w-4 h-4" />
                </button>

                <button
                  onClick={() => editor.chain().focus().toggleSuperscript().run()}
                  className={`p-1.5 rounded transition-colors ${
                    editor.isActive('superscript') ? 'bg-blue-100 text-[#106ebe] border border-blue-300' : 'hover:bg-gray-200 text-gray-700'
                  }`}
                  title="Superscript"
                >
                  <Superscript className="w-4 h-4" />
                </button>
              </div>

              {/* Color Palette */}
              <div className="flex items-center gap-1 border-r border-gray-300 pr-3 relative">
                <button
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="p-1.5 hover:bg-gray-200 rounded flex items-center gap-1 text-gray-700"
                  title="Font Color"
                >
                  <Palette className="w-4 h-4 text-blue-600" />
                </button>

                {showColorPicker && (
                  <div className="absolute top-10 left-0 bg-white border border-gray-300 rounded shadow-lg p-2 z-50 grid grid-cols-5 gap-1.5">
                    {colorSwatches.map((color) => (
                      <button
                        key={color}
                        onClick={() => {
                          editor.chain().focus().setColor(color).run();
                          setShowColorPicker(false);
                        }}
                        className="w-5 h-5 rounded border border-gray-300 hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Text Highlight Color Tool */}
              <div className="flex items-center gap-0.5 border-r border-gray-300 pr-3 relative">
                <button
                  onClick={() => {
                    if (editor.isActive('highlight')) {
                      editor.chain().focus().unsetHighlight().run();
                    } else {
                      setShowHighlightPicker(!showHighlightPicker);
                    }
                  }}
                  className={`p-1.5 rounded flex items-center gap-1 transition-colors ${
                    editor.isActive('highlight') ? 'bg-amber-200 text-amber-950 font-bold border border-amber-400' : 'hover:bg-gray-200 text-gray-700'
                  }`}
                  title="Highlight Selected Text (Click to toggle / pick color)"
                >
                  <Highlighter className="w-4 h-4 text-amber-500" />
                </button>
                <button
                  onClick={() => setShowHighlightPicker(!showHighlightPicker)}
                  className="text-[9px] text-gray-500 hover:text-gray-800 p-0.5 hover:bg-gray-200 rounded"
                  title="Choose Highlight Color"
                >
                  ▼
                </button>

                {showHighlightPicker && (
                  <div className="absolute top-10 left-0 bg-white border border-gray-300 rounded-lg shadow-xl p-2.5 z-50 flex flex-col gap-1.5 min-w-[140px]">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Highlight Color</span>
                    <div className="flex items-center gap-1.5">
                      {highlightSwatches.map((item) => (
                        <button
                          key={item.color}
                          onClick={() => {
                            editor.chain().focus().setHighlight({ color: item.color }).run();
                            setShowHighlightPicker(false);
                          }}
                          className="w-5 h-5 rounded-full border border-gray-400 hover:scale-125 transition-transform shadow-xs"
                          style={{ backgroundColor: item.color }}
                          title={item.name}
                        />
                      ))}
                    </div>
                    <button
                      onClick={() => {
                        editor.chain().focus().unsetHighlight().run();
                        setShowHighlightPicker(false);
                      }}
                      className="text-[11px] text-red-600 hover:bg-red-50 py-0.5 px-1 rounded text-left font-medium border-t border-gray-100 mt-1"
                    >
                      ✕ Clear Highlight
                    </button>
                  </div>
                )}
              </div>

              {/* Alignment */}
              <div className="flex items-center gap-0.5 border-r border-gray-300 pr-3">
                <button
                  onClick={() => editor.chain().focus().setTextAlign('left').run()}
                  className={`p-1.5 rounded ${editor.isActive({ textAlign: 'left' }) ? 'bg-blue-100 text-[#106ebe]' : 'hover:bg-gray-200 text-gray-700'}`}
                  title="Align Left"
                >
                  <AlignLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => editor.chain().focus().setTextAlign('center').run()}
                  className={`p-1.5 rounded ${editor.isActive({ textAlign: 'center' }) ? 'bg-blue-100 text-[#106ebe]' : 'hover:bg-gray-200 text-gray-700'}`}
                  title="Align Center"
                >
                  <AlignCenter className="w-4 h-4" />
                </button>
                <button
                  onClick={() => editor.chain().focus().setTextAlign('right').run()}
                  className={`p-1.5 rounded ${editor.isActive({ textAlign: 'right' }) ? 'bg-blue-100 text-[#106ebe]' : 'hover:bg-gray-200 text-gray-700'}`}
                  title="Align Right"
                >
                  <AlignRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                  className={`p-1.5 rounded ${editor.isActive({ textAlign: 'justify' }) ? 'bg-blue-100 text-[#106ebe]' : 'hover:bg-gray-200 text-gray-700'}`}
                  title="Justify"
                >
                  <AlignJustify className="w-4 h-4" />
                </button>
              </div>

              {/* Lists */}
              <div className="flex items-center gap-0.5 border-r border-gray-300 pr-3">
                <button
                  onClick={() => editor.chain().focus().toggleBulletList().run()}
                  className={`p-1.5 rounded ${editor.isActive('bulletList') ? 'bg-blue-100 text-[#106ebe]' : 'hover:bg-gray-200 text-gray-700'}`}
                  title="Bullet List"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => editor.chain().focus().toggleOrderedList().run()}
                  className={`p-1.5 rounded ${editor.isActive('orderedList') ? 'bg-blue-100 text-[#106ebe]' : 'hover:bg-gray-200 text-gray-700'}`}
                  title="Numbered List"
                >
                  <ListOrdered className="w-4 h-4" />
                </button>
              </div>

              {/* LTR & RTL Paragraph Direction Buttons */}
              <div className="flex items-center gap-1 bg-gray-200/80 p-1 rounded-md border border-gray-300">
                <button
                  onClick={() => {
                    setTextDirection('ltr');
                    editor.chain().focus().setTextAlign('left').run();
                  }}
                  className={`flex items-center justify-center px-2 py-1 rounded text-xs font-bold transition-all shadow-2xs ${
                    textDirection === 'ltr'
                      ? 'bg-[#106ebe] text-white ring-1 ring-blue-700 shadow-sm'
                      : 'bg-white hover:bg-gray-100 text-gray-800 border border-gray-300'
                  }`}
                  title="Left-to-Right Text Direction (>¶)"
                >
                  <span className="font-mono text-sm tracking-tighter">›¶</span>
                </button>

                <button
                  onClick={() => {
                    setTextDirection('rtl');
                    editor.chain().focus().setTextAlign('right').run();
                  }}
                  className={`flex items-center justify-center px-2 py-1 rounded text-xs font-bold transition-all shadow-2xs ${
                    textDirection === 'rtl'
                      ? 'bg-[#046a38] text-white ring-1 ring-emerald-700 shadow-sm'
                      : 'bg-white hover:bg-gray-100 text-gray-800 border border-gray-300'
                  }`}
                  title="Right-to-Left Text Direction (¶< - Lisan al Dawat / Arabic)"
                >
                  <span className="font-mono text-sm tracking-tighter">¶‹</span>
                </button>
              </div>

              {/* Arabic Keyboard Toggle */}
              <button
                onClick={onToggleArabicKeyboard}
                className="flex items-center gap-1 bg-emerald-700 hover:bg-emerald-800 text-white px-2.5 py-1 rounded text-xs font-bold shadow-xs transition-colors"
                title="Open On-Screen Arabic & Lisan al Dawat Virtual Keyboard"
              >
                <Keyboard className="w-3.5 h-3.5 text-emerald-200" />
                <span>Keyboard</span>
              </button>
            </div>
          )}

          {/* INSERT TAB */}
          {activeTab === 'insert' && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => document.getElementById('image-upload-input')?.click()}
                className="flex items-center gap-1.5 bg-purple-700 hover:bg-purple-800 text-white px-3 py-1.5 rounded font-bold shadow-sm transition-colors"
                title="Insert Image from device"
              >
                <Image className="w-4 h-4 text-purple-200" />
                <span>Insert Image</span>
              </button>

              <button
                onClick={onInsertDate}
                className="flex items-center gap-1.5 bg-white border border-gray-300 hover:bg-gray-50 px-3 py-1.5 rounded font-medium text-gray-700 shadow-sm"
              >
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>Insert Date</span>
              </button>

              <button
                onClick={() => onInsertBlock('bismillah')}
                className="flex items-center gap-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-serif px-3 py-1.5 rounded text-xs font-bold shadow-sm"
              >
                <span>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>
              </button>

              <button
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
                className="flex items-center gap-1.5 bg-white border border-gray-300 hover:bg-gray-50 px-3 py-1.5 rounded font-medium text-gray-700 shadow-sm"
              >
                <span>— Horizontal Line</span>
              </button>

              <button
                onClick={() => editor.chain().focus().insertContent('<div class="page-break" style="page-break-after: always; break-after: page; height: 16px;"></div><p></p>').run()}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs font-semibold shadow-xs transition-colors"
                title="Insert Page Break (Force content to next page)"
              >
                <FileText className="w-4 h-4 text-blue-100" />
                <span>Page Break</span>
              </button>

              {/* Table Management Tools */}
              <div className="flex items-center gap-1 bg-indigo-50/90 border border-indigo-200 p-1 rounded-lg">
                <button
                  onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
                  className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-2.5 py-1 rounded text-xs font-semibold shadow-xs transition-colors"
                >
                  <Table className="w-4 h-4 text-indigo-100" />
                  <span>Table (3x3)</span>
                </button>

                {editor.isActive('table') && (
                  <>
                    <div className="w-[1px] h-4 bg-indigo-300 mx-0.5"></div>
                    <button
                      onClick={() => editor.chain().focus().addRowAfter().run()}
                      className="bg-white hover:bg-indigo-100 border border-indigo-300 text-indigo-900 px-2 py-0.5 rounded text-xs font-medium transition-colors"
                      title="Add Row Below"
                    >
                      + Row
                    </button>
                    <button
                      onClick={() => editor.chain().focus().addColumnAfter().run()}
                      className="bg-white hover:bg-indigo-100 border border-indigo-300 text-indigo-900 px-2 py-0.5 rounded text-xs font-medium transition-colors"
                      title="Add Column Right"
                    >
                      + Col
                    </button>
                    <button
                      onClick={() => editor.chain().focus().deleteRow().run()}
                      className="bg-white hover:bg-red-100 border border-red-200 text-red-700 px-2 py-0.5 rounded text-xs font-medium transition-colors"
                      title="Delete Current Row"
                    >
                      - Row
                    </button>
                    <button
                      onClick={() => editor.chain().focus().deleteColumn().run()}
                      className="bg-white hover:bg-red-100 border border-red-200 text-red-700 px-2 py-0.5 rounded text-xs font-medium transition-colors"
                      title="Delete Current Column"
                    >
                      - Col
                    </button>
                    <button
                      onClick={() => editor.chain().focus().deleteTable().run()}
                      className="bg-red-600 hover:bg-red-700 text-white px-2 py-0.5 rounded text-xs font-bold transition-colors"
                      title="Delete Entire Table"
                    >
                      Delete Table
                    </button>
                  </>
                )}
              </div>

              <div className="flex items-center gap-1.5 bg-white border border-gray-300 px-2 py-1 rounded shadow-sm">
                <Stamp className="w-4 h-4 text-red-500" />
                <span className="text-gray-600 font-medium">Watermark:</span>
                <select
                  value={watermark}
                  onChange={(e) => setWatermark(e.target.value)}
                  className="bg-transparent text-xs font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="">None</option>
                  <option value="DRAFT">DRAFT</option>
                  <option value="CONFIDENTIAL">CONFIDENTIAL</option>
                  <option value="URGENT">URGENT</option>
                  <option value="OFFICIAL">OFFICIAL</option>
                </select>
              </div>
            </div>
          )}

          {/* LAYOUT TAB */}
          {activeTab === 'layout' && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-600">Page Size:</span>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(e.target.value)}
                  className="bg-white border border-gray-300 rounded px-2.5 py-1 font-semibold text-xs text-gray-800 shadow-sm focus:ring-1 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="A4">A4 (210 × 297 mm) — Default</option>
                  <option value="Letter">Letter (8.5 × 11 in)</option>
                  <option value="Legal">Legal (8.5 × 14 in)</option>
                  <option value="A5">A5 (148 × 210 mm)</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-600">Margins:</span>
                <div className="flex bg-white border border-gray-300 rounded p-0.5 shadow-sm">
                  {['normal', 'narrow', 'wide'].map((m) => (
                    <button
                      key={m}
                      onClick={() => setMargins(m)}
                      className={`px-2.5 py-1 rounded capitalize font-medium ${
                        margins === m ? 'bg-blue-100 text-[#106ebe] font-bold' : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-600">Orientation:</span>
                <div className="flex bg-white border border-gray-300 rounded p-0.5 shadow-sm">
                  <button
                    onClick={() => setOrientation('portrait')}
                    className={`px-2.5 py-1 rounded capitalize font-medium ${
                      orientation === 'portrait' ? 'bg-blue-100 text-[#106ebe] font-bold' : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    Portrait
                  </button>
                  <button
                    onClick={() => setOrientation('landscape')}
                    className={`px-2.5 py-1 rounded capitalize font-medium ${
                      orientation === 'landscape' ? 'bg-blue-100 text-[#106ebe] font-bold' : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    Landscape
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TEMPLATES TAB */}
          {activeTab === 'templates' && (
            <div className="flex items-center gap-3">
              <button
                onClick={onOpenTemplateModal}
                className="flex items-center gap-2 bg-[#106ebe] hover:bg-blue-700 text-white font-medium px-4 py-1.5 rounded shadow-sm"
              >
                <Layout className="w-4 h-4 text-blue-200" />
                <span>Browse All Templates</span>
              </button>
              <span className="text-gray-400">|</span>
              <span className="text-gray-600 font-bold">Quick Pick:</span>
              <button
                onClick={() => onInsertBlock('template-formal')}
                className="bg-white border border-gray-300 hover:bg-gray-50 px-2.5 py-1 rounded text-gray-700 font-medium"
              >
                Formal Business
              </button>
              <button
                onClick={() => onInsertBlock('template-lisan-arzi')}
                className="bg-emerald-50 border border-emerald-300 hover:bg-emerald-100 px-3 py-1 rounded text-emerald-900 font-bold font-serif"
              >
                عريضة لسان الدعوة (Arzi)
              </button>
              <button
                onClick={() => onInsertBlock('template-lisan-business')}
                className="bg-emerald-50 border border-emerald-300 hover:bg-emerald-100 px-3 py-1 rounded text-emerald-900 font-bold font-serif"
              >
                مكتوب تجاري (Business)
              </button>
            </div>
          )}

          {/* FILE TAB */}
          {activeTab === 'file' && (
            <div className="flex items-center gap-3">
              <button
                onClick={onNewLetter}
                className="flex items-center gap-1.5 bg-white border border-gray-300 hover:bg-gray-50 px-3 py-1.5 rounded text-gray-800 font-medium shadow-sm"
              >
                <Plus className="w-4 h-4 text-green-600" />
                <span>New Letter</span>
              </button>

              <label className="flex items-center gap-1.5 bg-white border border-blue-400 hover:bg-blue-50 text-[#106ebe] px-3 py-1.5 rounded font-bold shadow-sm cursor-pointer transition-colors">
                <FileText className="w-4 h-4 text-[#106ebe]" />
                <span>Open / Import (.docx)</span>
                <input
                  type="file"
                  accept=".docx"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file && onImportDOCX) {
                      onImportDOCX(file);
                    }
                  }}
                />
              </label>

              <button
                onClick={onExportDOCX}
                className="flex items-center gap-1.5 bg-[#106ebe] hover:bg-blue-800 text-white px-3.5 py-1.5 rounded font-bold shadow-sm transition-colors"
                title="Download as Editable Microsoft Word Document (.docx)"
              >
                <FileText className="w-4 h-4 text-blue-200" />
                <span>Download as Word (.docx)</span>
              </button>

              <button
                onClick={onExportPDF}
                className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded font-medium shadow-sm"
              >
                <Download className="w-4 h-4 text-red-200" />
                <span>Export as PDF</span>
              </button>

              <button
                onClick={onPrint}
                className="flex items-center gap-1.5 bg-gray-800 hover:bg-gray-900 text-white px-3 py-1.5 rounded font-medium shadow-sm"
              >
                <Printer className="w-4 h-4 text-gray-300" />
                <span>Print Letter</span>
              </button>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}

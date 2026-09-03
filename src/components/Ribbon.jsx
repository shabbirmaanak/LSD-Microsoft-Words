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
      <div className="bg-[#edf2fa] rounded-full mx-2 sm:mx-4 px-3 py-1 flex items-center gap-1 sm:gap-1.5 shadow-xs border border-[#dadce0]/60 overflow-x-auto text-xs text-gray-700">
        
        {/* Undo / Redo */}
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-1.5 hover:bg-black/10 rounded-full disabled:opacity-30 transition-colors text-gray-700"
          title="Undo (Ctrl+Z)"
        >
          <Undo2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-1.5 hover:bg-black/10 rounded-full disabled:opacity-30 transition-colors text-gray-700"
          title="Redo (Ctrl+Y)"
        >
          <Redo2 className="w-4 h-4" />
        </button>

        {/* Print */}
        <button
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
            onChange={(e) => {
              const val = e.target.value;
              editor.chain().focus().setFontFamily(val).run();
            }}
            className="bg-transparent hover:bg-black/5 text-gray-900 font-semibold px-2 py-1 rounded cursor-pointer focus:outline-none text-xs max-w-[170px] border border-transparent hover:border-gray-300"
            title="Lisan al Dawat Typography Fonts"
          >
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
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-1.5 rounded transition-colors ${editor.isActive('bold') ? 'bg-[#d3e3fd] text-[#041e49] font-bold' : 'hover:bg-black/10 text-gray-700'}`}
            title="Bold (Ctrl+B)"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-1.5 rounded transition-colors ${editor.isActive('italic') ? 'bg-[#d3e3fd] text-[#041e49]' : 'hover:bg-black/10 text-gray-700'}`}
            title="Italic (Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-1.5 rounded transition-colors ${editor.isActive('underline') ? 'bg-[#d3e3fd] text-[#041e49]' : 'hover:bg-black/10 text-gray-700'}`}
            title="Underline (Ctrl+U)"
          >
            <Underline className="w-4 h-4" />
          </button>
          <button
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
            <div className="absolute top-10 left-0 bg-white border border-gray-300 rounded-xl shadow-2xl p-2.5 z-50 grid grid-cols-10 gap-1 min-w-[240px]">
              {colorSwatches.map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    editor.chain().focus().setColor(color).run();
                    setShowColorPicker(false);
                  }}
                  className="w-4.5 h-4.5 rounded-full border border-gray-300 hover:scale-125 transition-transform"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          )}
        </div>

        {/* Highlight Color Popover */}
        <div ref={highlightPickerRef} className="relative">
          <button
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
            <div className="absolute top-10 left-0 bg-white border border-gray-300 rounded-xl shadow-2xl p-2.5 z-50 flex flex-col gap-2 min-w-[160px]">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Highlight Color</span>
              <div className="grid grid-cols-4 gap-1.5">
                {highlightSwatches.map((item) => (
                  <button
                    key={item.color}
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
                onClick={() => {
                  editor.chain().focus().unsetHighlight().run();
                  setShowHighlightPicker(false);
                }}
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

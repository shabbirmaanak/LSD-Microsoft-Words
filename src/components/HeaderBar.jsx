import React, { useState, useRef, useEffect } from 'react';
import { 
  FileText, 
  Save, 
  Printer, 
  Download, 
  FolderOpen, 
  Sparkles, 
  Check, 
  LayoutTemplate,
  Star,
  Cloud,
  Share2,
  Settings,
  Keyboard,
  Type,
  ChevronDown,
  Plus,
  Table,
  Image,
  Undo2,
  Redo2,
  HelpCircle,
  ShieldCheck,
  Calendar,
  Layers,
  Stamp
} from 'lucide-react';

export default function HeaderBar({
  docTitle,
  setDocTitle,
  isSaving,
  onSave,
  onNewLetter,
  onOpenSavedModal,
  onOpenTemplateModal,
  onExportPDF,
  onExportDOCX,
  onPrint,
  onToggleHelperDrawer,
  isHelperOpen,
  onToggleArabicKeyboard,
  isArabicKeyboardOpen,
  onOpenFontManagerModal,
  onOpenAdminModal,
  editorInstance,
  zoomLevel,
  setZoomLevel
}) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isStarred, setIsStarred] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null); // 'file', 'edit', 'view', 'insert', 'format', 'tools', 'extensions', 'help'
  const menuBarRef = useRef(null);
  const imageInputRef = useRef(null);

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file || !editorInstance) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result;
      if (src) {
        editorInstance.chain().focus().setImage({ src, width: '50%', class: 'align-left' }).run();
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Close menus on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuBarRef.current && !menuBarRef.current.contains(e.target)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = (menuName) => {
    setActiveMenu(activeMenu === menuName ? null : menuName);
  };

  const handleMenuHover = (menuName) => {
    if (activeMenu !== null) {
      setActiveMenu(menuName);
    }
  };

  return (
    <header className="bg-white border-b border-[#dadce0] select-none text-gray-800 z-50 relative no-print">
      {/* Top Main Navigation Bar */}
      <div className="flex items-center justify-between px-3 sm:px-4 pt-2 pb-1 gap-2">
        {/* Left Section: Google Docs Icon + Document Title + Star + Cloud Status + Menus */}
        <div className="flex items-start gap-3 min-w-0 flex-1">
          {/* Google Docs Blue Sheet Icon */}
          <div 
            onClick={onNewLetter}
            className="cursor-pointer hover:opacity-90 transition-opacity shrink-0 pt-0.5"
            title="al-kitābah — Google Docs for Lisan al Dawat"
          >
            <div className="w-10 h-10 bg-[#4285F4] rounded-lg flex items-center justify-center shadow-xs">
              <FileText className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* Title & Menus Container */}
          <div className="flex flex-col min-w-0 flex-1">
            {/* Title Row + Status */}
            <div className="flex items-center gap-2">
              {isEditingTitle ? (
                <input
                  type="text"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  onBlur={() => setIsEditingTitle(false)}
                  onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
                  autoFocus
                  className="text-base sm:text-lg font-medium text-gray-800 px-1.5 py-0.5 border border-[#4285F4] rounded focus:outline-none w-48 sm:w-80"
                />
              ) : (
                <div
                  onClick={() => setIsEditingTitle(true)}
                  className="text-base sm:text-lg font-medium text-gray-800 px-1.5 py-0.5 hover:border hover:border-gray-300 rounded cursor-pointer truncate max-w-[200px] sm:max-w-md transition-colors"
                  title="Click to rename"
                >
                  {docTitle || 'Untitled document'}
                </div>
              )}

              {/* Star Document */}
              <button
                onClick={() => setIsStarred(!isStarred)}
                className="p-1 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
                title={isStarred ? 'Starred' : 'Star document'}
              >
                <Star className={`w-4 h-4 ${isStarred ? 'text-amber-400 fill-amber-400' : 'text-gray-400'}`} />
              </button>

              {/* Cloud Sync Status */}
              <div className="flex items-center gap-1 text-[11px] text-gray-500 pl-1 hidden sm:flex">
                {isSaving ? (
                  <span className="flex items-center gap-1 text-blue-600">
                    <Cloud className="w-3.5 h-3.5 animate-pulse" />
                    <span>Saving...</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-gray-500 hover:text-gray-700 cursor-pointer" title="All changes saved to cloud">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <Cloud className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>
            </div>

            {/* Google Docs Dropdown Menubar */}
            <nav ref={menuBarRef} className="flex items-center text-xs text-gray-700 mt-0.5 relative flex-wrap gap-0.5">
              
              {/* FILE MENU */}
              <div className="relative">
                <button
                  onClick={() => toggleMenu('file')}
                  onMouseEnter={() => handleMenuHover('file')}
                  className={`px-2 py-1 rounded hover:bg-gray-100 transition-colors ${activeMenu === 'file' ? 'bg-gray-200' : ''}`}
                >
                  File
                </button>
                {activeMenu === 'file' && (
                  <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-xl py-1.5 z-50 text-xs text-gray-800">
                    <button
                      onClick={() => { onNewLetter?.(); setActiveMenu(null); }}
                      className="w-full text-left px-4 py-1.5 hover:bg-[#e8f0fe] hover:text-[#1a73e8] flex items-center justify-between"
                    >
                      <span className="flex items-center gap-2"><Plus className="w-4 h-4" /> New document</span>
                      <span className="text-gray-400 text-[10px]">Ctrl+N</span>
                    </button>
                    <button
                      onClick={() => { onOpenSavedModal?.(); setActiveMenu(null); }}
                      className="w-full text-left px-4 py-1.5 hover:bg-[#e8f0fe] hover:text-[#1a73e8] flex items-center gap-2"
                    >
                      <FolderOpen className="w-4 h-4" /> Open... (My Letters)
                    </button>
                    <button
                      onClick={() => { onOpenTemplateModal?.(); setActiveMenu(null); }}
                      className="w-full text-left px-4 py-1.5 hover:bg-[#e8f0fe] hover:text-[#1a73e8] flex items-center gap-2"
                    >
                      <LayoutTemplate className="w-4 h-4" /> New from template...
                    </button>
                    <div className="h-[1px] bg-gray-200 my-1"></div>
                    <button
                      onClick={() => { onSave?.(); setActiveMenu(null); }}
                      className="w-full text-left px-4 py-1.5 hover:bg-[#e8f0fe] hover:text-[#1a73e8] flex items-center justify-between"
                    >
                      <span className="flex items-center gap-2"><Save className="w-4 h-4" /> Save</span>
                      <span className="text-gray-400 text-[10px]">Ctrl+S</span>
                    </button>
                    <div className="h-[1px] bg-gray-200 my-1"></div>
                    <div className="px-4 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Download</div>
                    <button
                      onClick={() => { onExportPDF?.(); setActiveMenu(null); }}
                      className="w-full text-left px-4 py-1.5 hover:bg-[#e8f0fe] hover:text-[#1a73e8] flex items-center gap-2"
                    >
                      <Download className="w-4 h-4 text-red-600" /> PDF Document (.pdf)
                    </button>
                    <button
                      onClick={() => { onExportDOCX?.(); setActiveMenu(null); }}
                      className="w-full text-left px-4 py-1.5 hover:bg-[#e8f0fe] hover:text-[#1a73e8] flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4 text-blue-600" /> Microsoft Word (.docx)
                    </button>
                    <div className="h-[1px] bg-gray-200 my-1"></div>
                    <button
                      onClick={() => { onPrint?.(); setActiveMenu(null); }}
                      className="w-full text-left px-4 py-1.5 hover:bg-[#e8f0fe] hover:text-[#1a73e8] flex items-center justify-between"
                    >
                      <span className="flex items-center gap-2"><Printer className="w-4 h-4" /> Print</span>
                      <span className="text-gray-400 text-[10px]">Ctrl+P</span>
                    </button>
                  </div>
                )}
              </div>

              {/* EDIT MENU */}
              <div className="relative">
                <button
                  onClick={() => toggleMenu('edit')}
                  onMouseEnter={() => handleMenuHover('edit')}
                  className={`px-2 py-1 rounded hover:bg-gray-100 transition-colors ${activeMenu === 'edit' ? 'bg-gray-200' : ''}`}
                >
                  Edit
                </button>
                {activeMenu === 'edit' && (
                  <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-xl py-1.5 z-50 text-xs text-gray-800">
                    <button
                      onClick={() => { editorInstance?.chain().focus().undo().run(); setActiveMenu(null); }}
                      disabled={!editorInstance?.can().undo()}
                      className="w-full text-left px-4 py-1.5 hover:bg-[#e8f0fe] hover:text-[#1a73e8] flex items-center justify-between disabled:opacity-40"
                    >
                      <span className="flex items-center gap-2"><Undo2 className="w-4 h-4" /> Undo</span>
                      <span className="text-gray-400 text-[10px]">Ctrl+Z</span>
                    </button>
                    <button
                      onClick={() => { editorInstance?.chain().focus().redo().run(); setActiveMenu(null); }}
                      disabled={!editorInstance?.can().redo()}
                      className="w-full text-left px-4 py-1.5 hover:bg-[#e8f0fe] hover:text-[#1a73e8] flex items-center justify-between disabled:opacity-40"
                    >
                      <span className="flex items-center gap-2"><Redo2 className="w-4 h-4" /> Redo</span>
                      <span className="text-gray-400 text-[10px]">Ctrl+Y</span>
                    </button>
                    <div className="h-[1px] bg-gray-200 my-1"></div>
                    <button
                      onClick={() => { editorInstance?.chain().focus().selectAll().run(); setActiveMenu(null); }}
                      className="w-full text-left px-4 py-1.5 hover:bg-[#e8f0fe] hover:text-[#1a73e8] flex items-center justify-between"
                    >
                      <span>Select all</span>
                      <span className="text-gray-400 text-[10px]">Ctrl+A</span>
                    </button>
                  </div>
                )}
              </div>

              {/* VIEW MENU */}
              <div className="relative">
                <button
                  onClick={() => toggleMenu('view')}
                  onMouseEnter={() => handleMenuHover('view')}
                  className={`px-2 py-1 rounded hover:bg-gray-100 transition-colors ${activeMenu === 'view' ? 'bg-gray-200' : ''}`}
                >
                  View
                </button>
                {activeMenu === 'view' && (
                  <div className="absolute top-full left-0 mt-1 w-52 bg-white border border-gray-200 rounded-lg shadow-xl py-1.5 z-50 text-xs text-gray-800">
                    <div className="px-4 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Zoom Level</div>
                    {[50, 75, 90, 100, 125, 150, 200].map((z) => (
                      <button
                        key={z}
                        onClick={() => { setZoomLevel?.(z); setActiveMenu(null); }}
                        className={`w-full text-left px-4 py-1.5 hover:bg-[#e8f0fe] hover:text-[#1a73e8] flex items-center justify-between ${
                          zoomLevel === z ? 'font-bold text-[#1a73e8]' : ''
                        }`}
                      >
                        <span>{z}%</span>
                        {zoomLevel === z && <Check className="w-3.5 h-3.5 text-[#1a73e8]" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* INSERT MENU */}
              <div className="relative">
                <button
                  onClick={() => toggleMenu('insert')}
                  onMouseEnter={() => handleMenuHover('insert')}
                  className={`px-2 py-1 rounded hover:bg-gray-100 transition-colors ${activeMenu === 'insert' ? 'bg-gray-200' : ''}`}
                >
                  Insert
                </button>
                {activeMenu === 'insert' && (
                  <div className="absolute top-full left-0 mt-1 w-60 bg-white border border-gray-200 rounded-lg shadow-xl py-1.5 z-50 text-xs text-gray-800">
                    <button
                      onClick={() => {
                        editorInstance?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
                        setActiveMenu(null);
                      }}
                      className="w-full text-left px-4 py-1.5 hover:bg-[#e8f0fe] hover:text-[#1a73e8] flex items-center gap-2"
                    >
                      <Table className="w-4 h-4" /> Table (3 × 3)
                    </button>
                    <button
                      onClick={() => {
                        editorInstance?.chain().focus().insertContent('<p class="bismillah-header">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>').run();
                        setActiveMenu(null);
                      }}
                      className="w-full text-left px-4 py-1.5 hover:bg-[#e8f0fe] hover:text-[#1a73e8] flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 text-emerald-600" /> Bismillah Header
                    </button>
                    <button
                      onClick={() => {
                        const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                        editorInstance?.chain().focus().insertContent(`<p><strong>Date:</strong> ${dateStr}</p>`).run();
                        setActiveMenu(null);
                      }}
                      className="w-full text-left px-4 py-1.5 hover:bg-[#e8f0fe] hover:text-[#1a73e8] flex items-center gap-2"
                    >
                      <Calendar className="w-4 h-4" /> Date
                    </button>
                    <button
                      onClick={() => {
                        imageInputRef.current?.click();
                        setActiveMenu(null);
                      }}
                      className="w-full text-left px-4 py-1.5 hover:bg-[#e8f0fe] hover:text-[#1a73e8] flex items-center gap-2"
                    >
                      <Image className="w-4 h-4 text-purple-600" /> Image (Upload / Paste)
                    </button>
                    <div className="h-[1px] bg-gray-200 my-1"></div>
                    <button
                      onClick={() => {
                        editorInstance?.chain().focus().setHorizontalRule().run();
                        setActiveMenu(null);
                      }}
                      className="w-full text-left px-4 py-1.5 hover:bg-[#e8f0fe] hover:text-[#1a73e8] flex items-center gap-2"
                    >
                      <span>─── Horizontal line</span>
                    </button>
                  </div>
                )}
                {/* Hidden File Input for Image Insertion */}
                <input 
                  type="file" 
                  ref={imageInputRef} 
                  onChange={handleImageFileChange} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>

              {/* FORMAT MENU */}
              <div className="relative">
                <button
                  onClick={() => toggleMenu('format')}
                  onMouseEnter={() => handleMenuHover('format')}
                  className={`px-2 py-1 rounded hover:bg-gray-100 transition-colors ${activeMenu === 'format' ? 'bg-gray-200' : ''}`}
                >
                  Format
                </button>
                {activeMenu === 'format' && (
                  <div className="absolute top-full left-0 mt-1 w-60 bg-white border border-gray-200 rounded-lg shadow-xl py-1.5 z-50 text-xs text-gray-800">
                    <button
                      onClick={() => { editorInstance?.chain().focus().toggleBold().run(); setActiveMenu(null); }}
                      className="w-full text-left px-4 py-1.5 hover:bg-[#e8f0fe] hover:text-[#1a73e8] flex items-center justify-between font-bold"
                    >
                      <span>Bold</span>
                      <span className="text-gray-400 text-[10px]">Ctrl+B</span>
                    </button>
                    <button
                      onClick={() => { editorInstance?.chain().focus().toggleItalic().run(); setActiveMenu(null); }}
                      className="w-full text-left px-4 py-1.5 hover:bg-[#e8f0fe] hover:text-[#1a73e8] flex items-center justify-between italic"
                    >
                      <span>Italic</span>
                      <span className="text-gray-400 text-[10px]">Ctrl+I</span>
                    </button>
                    <button
                      onClick={() => { editorInstance?.chain().focus().toggleUnderline().run(); setActiveMenu(null); }}
                      className="w-full text-left px-4 py-1.5 hover:bg-[#e8f0fe] hover:text-[#1a73e8] flex items-center justify-between underline"
                    >
                      <span>Underline</span>
                      <span className="text-gray-400 text-[10px]">Ctrl+U</span>
                    </button>
                    <button
                      onClick={() => { editorInstance?.chain().focus().toggleStrike().run(); setActiveMenu(null); }}
                      className="w-full text-left px-4 py-1.5 hover:bg-[#e8f0fe] hover:text-[#1a73e8] flex items-center justify-between line-through"
                    >
                      <span>Strikethrough</span>
                    </button>
                    <div className="h-[1px] bg-gray-200 my-1"></div>
                    <button
                      onClick={() => { editorInstance?.chain().focus().unsetAllMarks().clearNodes().run(); setActiveMenu(null); }}
                      className="w-full text-left px-4 py-1.5 hover:bg-[#e8f0fe] hover:text-[#1a73e8] flex items-center justify-between text-red-600"
                    >
                      <span>Clear formatting</span>
                      <span className="text-gray-400 text-[10px]">Ctrl+\</span>
                    </button>
                  </div>
                )}
              </div>

              {/* TOOLS MENU */}
              <div className="relative">
                <button
                  onClick={() => toggleMenu('tools')}
                  onMouseEnter={() => handleMenuHover('tools')}
                  className={`px-2 py-1 rounded hover:bg-gray-100 transition-colors ${activeMenu === 'tools' ? 'bg-gray-200' : ''}`}
                >
                  Tools
                </button>
                {activeMenu === 'tools' && (
                  <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-xl py-1.5 z-50 text-xs text-gray-800">
                    <button
                      onClick={() => { onToggleArabicKeyboard?.(); setActiveMenu(null); }}
                      className="w-full text-left px-4 py-1.5 hover:bg-[#e8f0fe] hover:text-[#1a73e8] flex items-center gap-2"
                    >
                      <Keyboard className="w-4 h-4 text-emerald-600" />
                      <span>Lisan al Dawat Virtual Keyboard</span>
                    </button>
                    <button
                      onClick={() => { onToggleHelperDrawer?.(); setActiveMenu(null); }}
                      className="w-full text-left px-4 py-1.5 hover:bg-[#e8f0fe] hover:text-[#1a73e8] flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>Letter Writing Assistant (AI)</span>
                    </button>
                    <button
                      onClick={() => { onOpenFontManagerModal?.(); setActiveMenu(null); }}
                      className="w-full text-left px-4 py-1.5 hover:bg-[#e8f0fe] hover:text-[#1a73e8] flex items-center gap-2"
                    >
                      <Type className="w-4 h-4 text-blue-600" />
                      <span>Font Manager (LSD Typography)</span>
                    </button>
                  </div>
                )}
              </div>

              {/* EXTENSIONS & ADMIN */}
              <div className="relative">
                <button
                  onClick={() => toggleMenu('extensions')}
                  onMouseEnter={() => handleMenuHover('extensions')}
                  className={`px-2 py-1 rounded hover:bg-gray-100 transition-colors ${activeMenu === 'extensions' ? 'bg-gray-200' : ''}`}
                >
                  Extensions
                </button>
                {activeMenu === 'extensions' && (
                  <div className="absolute top-full left-0 mt-1 w-60 bg-white border border-gray-200 rounded-lg shadow-xl py-1.5 z-50 text-xs text-gray-800">
                    <button
                      onClick={() => { onOpenAdminModal?.(); setActiveMenu(null); }}
                      className="w-full text-left px-4 py-1.5 hover:bg-[#e8f0fe] hover:text-[#1a73e8] flex items-center gap-2 font-semibold"
                    >
                      <ShieldCheck className="w-4 h-4 text-blue-600" />
                      <span>Admin CMS Studio</span>
                    </button>
                  </div>
                )}
              </div>

            </nav>
          </div>
        </div>

        {/* Right Section: Share Pill + Quick Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Templates Button */}
          <button
            onClick={onOpenTemplateModal}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-semibold text-gray-700 transition-colors"
            title="Browse letter templates"
          >
            <LayoutTemplate className="w-3.5 h-3.5 text-blue-600" />
            <span>Templates</span>
          </button>

          {/* Direct Print Button */}
          <button
            onClick={onPrint}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-600 hover:text-gray-900 transition-colors"
            title="Print Document (Ctrl+P)"
          >
            <Printer className="w-4 h-4" />
          </button>

          {/* Google Docs Blue Share / Export Pill Button */}
          <button
            onClick={onExportPDF}
            className="bg-[#c2e7ff] hover:bg-[#b3dcff] text-[#001d35] font-bold px-4 py-2 rounded-full text-xs flex items-center gap-1.5 shadow-2xs transition-colors"
            title="Export / Share Document as PDF"
          >
            <Download className="w-3.5 h-3.5 text-[#001d35]" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>
    </header>
  );
}

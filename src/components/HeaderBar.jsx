import React, { useState } from 'react';
import { 
  FileText, 
  Save, 
  Printer, 
  Download, 
  FolderOpen, 
  Sparkles, 
  Check, 
  LayoutTemplate
} from 'lucide-react';

export default function HeaderBar({
  docTitle,
  setDocTitle,
  isSaving,
  onSave,
  onOpenSavedModal,
  onOpenTemplateModal,
  onExportPDF,
  onPrint,
  onToggleHelperDrawer,
  isHelperOpen
}) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  return (
    <header className="bg-[#106ebe] text-white flex items-center justify-between px-2 sm:px-4 py-2 border-b border-blue-800 select-none shadow-sm z-30 flex-wrap gap-2 no-print">
      {/* Left section: App Icon & Title */}
      <div className="flex items-center space-x-2 sm:space-x-3 max-w-[50%] sm:max-w-none">
        <div className="bg-white text-[#106ebe] p-1 sm:p-1.5 rounded flex items-center justify-center font-bold shadow-sm shrink-0">
          <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-[#106ebe]" />
        </div>
        <div className="flex flex-col min-w-0">
          <div className="flex items-center space-x-1.5 sm:space-x-2 truncate">
            {isEditingTitle ? (
              <input
                type="text"
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                onBlur={() => setIsEditingTitle(false)}
                onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
                autoFocus
                className="bg-white text-gray-900 px-1.5 py-0.5 rounded text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-300 w-32 sm:w-auto"
              />
            ) : (
              <button
                onClick={() => setIsEditingTitle(true)}
                className="hover:bg-blue-700/60 px-1.5 py-0.5 rounded text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1 group truncate"
                title="Click to rename document"
              >
                <span className="truncate max-w-[120px] sm:max-w-[200px]">{docTitle || 'Untitled Letter'}</span>
                <span className="text-xs text-blue-200 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:inline">✏️</span>
              </button>
            )}
            <span className="text-[10px] sm:text-xs bg-blue-700/80 px-1.5 py-0.5 rounded text-blue-100 font-medium flex items-center gap-1 shrink-0">
              {isSaving ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-ping"></span>
                  <span className="hidden sm:inline">Saving...</span>
                </>
              ) : (
                <>
                  <Check className="w-3 h-3 text-green-300" />
                  <span className="hidden sm:inline">Saved</span>
                </>
              )}
            </span>
          </div>
          <span className="text-[10px] sm:text-[11px] text-blue-100 font-normal pl-1 truncate hidden sm:block">
            al-kitābah — الكتابة
          </span>
        </div>
      </div>

      {/* Right section: Action Buttons */}
      <div className="flex items-center space-x-1 sm:space-x-2">
        <button
          onClick={onOpenTemplateModal}
          className="flex items-center gap-1 bg-blue-700/80 hover:bg-blue-700 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded text-xs font-medium transition-colors shadow-sm"
          title="Browse letter templates"
        >
          <LayoutTemplate className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-200" />
          <span className="hidden sm:inline">Templates</span>
        </button>

        <button
          onClick={onOpenSavedModal}
          className="flex items-center gap-1 bg-blue-700/80 hover:bg-blue-700 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded text-xs font-medium transition-colors shadow-sm"
          title="Manage saved drafts"
        >
          <FolderOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-200" />
          <span className="hidden sm:inline">My Letters</span>
        </button>

        <button
          onClick={onToggleHelperDrawer}
          className={`flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded text-xs font-medium transition-all shadow-sm ${
            isHelperOpen 
              ? 'bg-amber-400 text-blue-950 font-semibold' 
              : 'bg-amber-500/90 hover:bg-amber-500 text-blue-950 font-semibold'
          }`}
          title="Toggle Letter Helper Assistant"
        >
          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="hidden md:inline">Assistant</span>
        </button>

        <div className="h-4 w-[1px] bg-blue-500/50 mx-0.5 sm:mx-1"></div>

        <button
          onClick={onSave}
          className="p-1 sm:p-1.5 hover:bg-blue-700/60 rounded text-blue-100 hover:text-white transition-colors"
          title="Save Letter Draft"
        >
          <Save className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
        </button>

        <button
          onClick={onExportPDF}
          className="p-1 sm:p-1.5 hover:bg-blue-700/60 rounded text-blue-100 hover:text-white transition-colors"
          title="Export to PDF"
        >
          <Download className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
        </button>

        <button
          onClick={onPrint}
          className="p-1 sm:p-1.5 hover:bg-blue-700/60 rounded text-blue-100 hover:text-white transition-colors"
          title="Print Document"
        >
          <Printer className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
        </button>
      </div>
    </header>
  );
}

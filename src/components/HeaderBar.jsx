import React, { useState } from 'react';
import { 
  FileText, 
  Save, 
  Printer, 
  Download, 
  FolderOpen, 
  Sparkles, 
  Check, 
  HelpCircle, 
  Share2,
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
    <header className="bg-[#106ebe] text-white flex items-center justify-between px-4 py-2 border-b border-blue-800 select-none shadow-sm z-30">
      {/* Left section: App Icon & Title */}
      <div className="flex items-center space-x-3">
        <div className="bg-white text-[#106ebe] p-1.5 rounded flex items-center justify-center font-bold shadow-sm">
          <FileText className="w-5 h-5 text-[#106ebe]" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center space-x-2">
            {isEditingTitle ? (
              <input
                type="text"
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                onBlur={() => setIsEditingTitle(false)}
                onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
                autoFocus
                className="bg-white text-gray-900 px-2 py-0.5 rounded text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            ) : (
              <button
                onClick={() => setIsEditingTitle(true)}
                className="hover:bg-blue-700/60 px-2 py-0.5 rounded text-sm font-semibold transition-colors flex items-center gap-1.5 group"
                title="Click to rename document"
              >
                <span>{docTitle || 'Untitled Letter'}</span>
                <span className="text-xs text-blue-200 opacity-0 group-hover:opacity-100 transition-opacity">✏️</span>
              </button>
            )}
            <span className="text-xs bg-blue-700/80 px-2 py-0.5 rounded text-blue-100 font-medium flex items-center gap-1">
              {isSaving ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-yellow-400 animate-ping"></span>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check className="w-3 h-3 text-green-300" />
                  <span>Saved</span>
                </>
              )}
            </span>
          </div>
          <span className="text-[11px] text-blue-100 font-normal pl-2">
            Microsoft Word Online — Letter Edition
          </span>
        </div>
      </div>

      {/* Right section: Action Buttons */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onOpenTemplateModal}
          className="flex items-center gap-1.5 bg-blue-700/80 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors shadow-sm"
          title="Browse letter templates"
        >
          <LayoutTemplate className="w-4 h-4 text-blue-200" />
          <span>Templates</span>
        </button>

        <button
          onClick={onOpenSavedModal}
          className="flex items-center gap-1.5 bg-blue-700/80 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors shadow-sm"
          title="Manage saved drafts"
        >
          <FolderOpen className="w-4 h-4 text-blue-200" />
          <span>My Letters</span>
        </button>

        <button
          onClick={onToggleHelperDrawer}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all shadow-sm ${
            isHelperOpen 
              ? 'bg-amber-400 text-blue-950 font-semibold' 
              : 'bg-amber-500/90 hover:bg-amber-500 text-blue-950 font-semibold'
          }`}
          title="Toggle Letter Helper & AI Tone Assistant"
        >
          <Sparkles className="w-4 h-4" />
          <span>Letter Assistant</span>
        </button>

        <div className="h-5 w-[1px] bg-blue-500/50 mx-1"></div>

        <button
          onClick={onSave}
          className="p-1.5 hover:bg-blue-700/60 rounded text-blue-100 hover:text-white transition-colors"
          title="Save Letter Draft"
        >
          <Save className="w-4.5 h-4.5" />
        </button>

        <button
          onClick={onExportPDF}
          className="p-1.5 hover:bg-blue-700/60 rounded text-blue-100 hover:text-white transition-colors"
          title="Export to PDF"
        >
          <Download className="w-4.5 h-4.5" />
        </button>

        <button
          onClick={onPrint}
          className="p-1.5 hover:bg-blue-700/60 rounded text-blue-100 hover:text-white transition-colors"
          title="Print Document"
        >
          <Printer className="w-4.5 h-4.5" />
        </button>
      </div>
    </header>
  );
}

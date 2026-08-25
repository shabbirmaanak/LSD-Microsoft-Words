import React from 'react';
import { X, FolderOpen, FileText, Trash2, Edit3, Plus, ArrowRight, Clock } from 'lucide-react';

export default function SavedDocsModal({
  isOpen,
  onClose,
  savedLetters,
  onLoadLetter,
  onDeleteLetter,
  onNewLetter
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden border border-gray-200 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-[#106ebe] text-white p-4 px-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <FolderOpen className="w-5 h-5 text-blue-200" />
            <h2 className="text-lg font-bold">My Saved Letters</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded transition-colors text-blue-100 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-5 overflow-y-auto flex-1 space-y-3">
          {savedLetters.length === 0 ? (
            <div className="py-12 text-center text-gray-500 flex flex-col items-center">
              <FileText className="w-12 h-12 text-gray-300 mb-2" />
              <p className="font-semibold text-gray-700">No saved letters yet</p>
              <p className="text-xs text-gray-400 mt-1">Letters you save will appear here automatically.</p>
              <button
                onClick={() => {
                  onNewLetter();
                  onClose();
                }}
                className="mt-4 flex items-center gap-1.5 bg-[#106ebe] text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-sm hover:bg-blue-700 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Start New Letter</span>
              </button>
            </div>
          ) : (
            savedLetters.map((doc) => (
              <div
                key={doc.id}
                className="group border border-gray-200 hover:border-blue-500 rounded-lg p-3.5 flex items-center justify-between transition-all bg-white hover:shadow-xs"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg text-[#106ebe] group-hover:bg-[#106ebe] group-hover:text-white transition-colors">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm group-hover:text-[#106ebe] transition-colors">
                      {doc.title || 'Untitled Letter'}
                    </h4>
                    <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(doc.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span>•</span>
                      <span>{doc.wordCount || 0} words</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onLoadLetter(doc);
                      onClose();
                    }}
                    className="flex items-center gap-1 bg-[#106ebe] hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs font-medium shadow-xs transition-colors"
                  >
                    <span>Open</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onDeleteLetter(doc.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Delete Draft"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <button
            onClick={() => {
              onNewLetter();
              onClose();
            }}
            className="flex items-center gap-1.5 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4 text-green-600" />
            <span>Create New Blank Letter</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-200 text-xs font-medium text-gray-700 transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}

import React from 'react';
import { ZoomIn, ZoomOut, CheckCircle2, Clock, FileText } from 'lucide-react';

export default function StatusBar({
  wordCount,
  charCount,
  zoomLevel,
  setZoomLevel,
  totalPages = 1,
  pageSize = 'A4'
}) {
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <footer className="bg-[#f3f2f1] border-t border-gray-300 px-2 sm:px-4 py-1 flex items-center justify-between text-xs text-gray-600 select-none z-30 shadow-xs text-[11px] sm:text-xs no-print">
      
      {/* Left section: Page info & Word metrics */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        <div className="flex items-center gap-1 font-medium text-gray-700">
          <FileText className="w-3.5 h-3.5 text-blue-600" />
          <span className="hidden sm:inline font-semibold">Page 1 of {totalPages} ({pageSize})</span>
        </div>

        <div className="h-3 w-[1px] bg-gray-300 hidden sm:block"></div>

        <div>
          <span className="font-semibold text-gray-800">{wordCount}</span> words
        </div>

        <div className="hidden sm:block">
          <span className="font-semibold text-gray-800">{charCount}</span> chars
        </div>

        <div className="h-3 w-[1px] bg-gray-300 hidden md:block"></div>

        <div className="hidden md:flex items-center gap-1 text-gray-500">
          <Clock className="w-3 h-3 text-gray-400" />
          <span>~{readingTime} min read</span>
        </div>
      </div>

      {/* Right section: Zoom Controls */}
      <div className="flex items-center space-x-1 sm:space-x-2">
        <button
          onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))}
          className="p-1 hover:bg-gray-200 rounded text-gray-600 transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>

        <input
          type="range"
          min="50"
          max="150"
          value={zoomLevel}
          onChange={(e) => setZoomLevel(Number(e.target.value))}
          className="w-16 sm:w-24 accent-blue-600 cursor-pointer"
        />

        <button
          onClick={() => setZoomLevel(Math.min(150, zoomLevel + 10))}
          className="p-1 hover:bg-gray-200 rounded text-gray-600 transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>

        <span className="w-8 text-right font-semibold text-gray-700 text-[10px] sm:text-xs">
          {zoomLevel}%
        </span>
      </div>
    </footer>
  );
}

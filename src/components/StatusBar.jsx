import React from 'react';
import { ZoomIn, ZoomOut, CheckCircle2, Clock, FileText } from 'lucide-react';

export default function StatusBar({
  wordCount,
  charCount,
  zoomLevel,
  setZoomLevel
}) {
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <footer className="bg-[#f3f2f1] border-t border-gray-300 px-4 py-1 flex items-center justify-between text-xs text-gray-600 select-none z-30 shadow-xs">
      
      {/* Left section: Page info & Word metrics */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center gap-1 font-medium text-gray-700">
          <FileText className="w-3.5 h-3.5 text-blue-600" />
          <span>Page 1 of 1</span>
        </div>

        <div className="h-3 w-[1px] bg-gray-300"></div>

        <div>
          <span className="font-semibold text-gray-800">{wordCount}</span> words
        </div>

        <div>
          <span className="font-semibold text-gray-800">{charCount}</span> characters
        </div>

        <div className="h-3 w-[1px] bg-gray-300"></div>

        <div className="flex items-center gap-1 text-gray-500">
          <Clock className="w-3 h-3 text-gray-400" />
          <span>~{readingTime} min read</span>
        </div>

        <div className="h-3 w-[1px] bg-gray-300"></div>

        <div className="flex items-center gap-1 text-emerald-600 font-medium">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Letter Format Valid</span>
        </div>
      </div>

      {/* Right section: Zoom Controls */}
      <div className="flex items-center space-x-2">
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
          step="5"
          value={zoomLevel}
          onChange={(e) => setZoomLevel(Number(e.target.value))}
          className="w-24 h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-[#106ebe]"
        />

        <button
          onClick={() => setZoomLevel(Math.min(150, zoomLevel + 10))}
          className="p-1 hover:bg-gray-200 rounded text-gray-600 transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => setZoomLevel(100)}
          className="font-semibold text-gray-700 hover:text-blue-600 px-1.5 py-0.5 rounded hover:bg-gray-200 transition-colors"
          title="Reset Zoom to 100%"
        >
          {zoomLevel}%
        </button>
      </div>

    </footer>
  );
}

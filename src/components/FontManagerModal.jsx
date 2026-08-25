import React, { useState } from 'react';
import { X, Check, Settings, Plus, Trash2, Type, Sliders } from 'lucide-react';

export default function FontManagerModal({
  isOpen,
  onClose,
  allAvailableFonts,
  activeFontValues,
  onSaveActiveFonts,
  customFonts,
  onOpenFontUploadModal
}) {
  const [selectedFontValues, setSelectedFontValues] = useState(activeFontValues);
  const [newFontName, setNewFontName] = useState('');

  if (!isOpen) return null;

  const toggleFont = (value) => {
    if (selectedFontValues.includes(value)) {
      if (selectedFontValues.length <= 1) return; // Keep at least 1 font
      setSelectedFontValues(selectedFontValues.filter((v) => v !== value));
    } else {
      setSelectedFontValues([...selectedFontValues, value]);
    }
  };

  const handleAddNewFontName = () => {
    if (!newFontName.trim()) return;
    const fontVal = `${newFontName.trim()}, sans-serif`;
    if (!selectedFontValues.includes(fontVal)) {
      setSelectedFontValues([...selectedFontValues, fontVal]);
    }
    setNewFontName('');
  };

  const handleSave = () => {
    onSaveActiveFonts(selectedFontValues);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4" dir="ltr">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-[#106ebe] text-white p-4 px-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-5 h-5 text-blue-200" />
            <h2 className="text-base font-bold">Configure Visible Fonts List</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded transition-colors text-blue-100 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 text-xs">
          
          <p className="text-gray-600 leading-relaxed">
            Select which fonts appear in your ribbon dropdown menu. Only checked fonts will be displayed.
          </p>

          {/* Font List Checklist */}
          <div className="border border-gray-200 rounded-lg p-2 max-h-56 overflow-y-auto space-y-1 bg-gray-50">
            {allAvailableFonts.map((f) => {
              const isChecked = selectedFontValues.includes(f.value);
              return (
                <label
                  key={f.value}
                  className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                    isChecked ? 'bg-blue-50 border border-blue-200 text-blue-900 font-semibold' : 'hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  <span className="text-xs" style={{ fontFamily: f.value }}>
                    {f.name}
                  </span>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleFont(f.value)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                  />
                </label>
              );
            })}
          </div>

          {/* Quick Add Custom System Font Name */}
          <div className="pt-2 border-t border-gray-200 space-y-2">
            <label className="block font-bold text-gray-800">Add System Font by Name:</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Al Bayan, Tahoma, Traditional Arabic"
                value={newFontName}
                onChange={(e) => setNewFontName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddNewFontName()}
                className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-xs"
              />
              <button
                onClick={handleAddNewFontName}
                className="bg-gray-800 hover:bg-gray-900 text-white px-3 py-1.5 rounded-lg text-xs font-semibold"
              >
                Add
              </button>
            </div>
          </div>

          {/* Link to Upload Custom Font File */}
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-emerald-900">
            <span>Have a font file (.ttf / .otf)?</span>
            <button
              onClick={() => {
                onClose();
                onOpenFontUploadModal();
              }}
              className="text-xs font-bold text-emerald-800 underline hover:text-emerald-950"
            >
              Upload TTF File
            </button>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-200 text-xs font-semibold text-gray-700 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 bg-[#106ebe] hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-xs font-bold shadow-md transition-all"
          >
            <Check className="w-4 h-4" />
            <span>Save Font List</span>
          </button>
        </div>

      </div>
    </div>
  );
}

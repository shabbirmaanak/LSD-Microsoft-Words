import React, { useState } from 'react';
import { X, Upload, Type, Check, Trash2, FileCode, AlertCircle } from 'lucide-react';

export default function FontUploadModal({
  isOpen,
  onClose,
  customFonts,
  onAddCustomFont,
  onRemoveCustomFont
}) {
  const [fontName, setFontName] = useState('');
  const [fontFile, setFontFile] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validExts = ['.ttf', '.otf', '.woff', '.woff2'];
    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

    if (!validExts.includes(ext)) {
      setErrorMsg('Invalid font format. Please upload a .ttf, .otf, .woff, or .woff2 file.');
      setFontFile(null);
      return;
    }

    setErrorMsg('');
    setFontFile(file);
    if (!fontName) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setFontName(cleanName);
    }
  };

  const handleUpload = async () => {
    if (!fontFile || !fontName.trim()) {
      setErrorMsg('Please enter a font name and select a valid font file.');
      return;
    }

    setIsProcessing(true);
    try {
      const arrayBuffer = await fontFile.arrayBuffer();
      const fontFaceName = fontName.trim();
      
      // Load Font into Browser Document dynamically
      const fontFace = new FontFace(fontFaceName, arrayBuffer);
      const loadedFace = await fontFace.load();
      document.fonts.add(loadedFace);

      // Convert ArrayBuffer to Base64 string for localStorage persistence
      const bytes = new Uint8Array(arrayBuffer);
      let binary = '';
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      const base64Data = window.btoa(binary);

      const fontObj = {
        name: fontFaceName,
        fileName: fontFile.name,
        format: fontFile.name.substring(fontFile.name.lastIndexOf('.') + 1),
        base64Data: `data:font/${fontFile.name.split('.').pop()};base64,${base64Data}`
      };

      onAddCustomFont(fontObj);
      setFontName('');
      setFontFile(null);
      setIsProcessing(false);
      onClose();
    } catch (err) {
      console.error('Failed to load custom font', err);
      setErrorMsg('Failed to process font file. Please ensure it is a valid TTF/OTF/WOFF file.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-200 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-[#046a38] text-white p-4 px-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Upload className="w-5 h-5 text-emerald-200" />
            <h2 className="text-base font-bold">Upload Custom Font / إضافة خط خاص</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded transition-colors text-emerald-100 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 text-xs">
          
          <p className="text-gray-600 leading-relaxed">
            Upload your own Lisan al Dawat or Arabic font files (<strong>.ttf, .otf, .woff, .woff2</strong>). The font will be registered into the Word ribbon font family selector.
          </p>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form inputs */}
          <div className="space-y-3">
            <div>
              <label className="block font-bold text-gray-800 mb-1">Font Display Name:</label>
              <input
                type="text"
                placeholder="e.g. Lisan Dawat Custom, Al-Khatt, etc."
                value={fontName}
                onChange={(e) => setFontName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-800 mb-1">Select Font File (.ttf, .otf, .woff):</label>
              <label className="border-2 border-dashed border-gray-300 hover:border-emerald-500 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer bg-gray-50 hover:bg-emerald-50/50 transition-colors">
                <FileCode className="w-8 h-8 text-emerald-600 mb-1" />
                {fontFile ? (
                  <span className="font-bold text-emerald-800 text-xs">{fontFile.name} ({(fontFile.size / 1024).toFixed(1)} KB)</span>
                ) : (
                  <span className="text-gray-500 text-xs">Click or drag font file here</span>
                )}
                <input
                  type="file"
                  accept=".ttf,.otf,.woff,.woff2"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* List of uploaded custom fonts */}
          {customFonts.length > 0 && (
            <div className="border-t border-gray-200 pt-3">
              <h4 className="font-bold text-gray-800 mb-2">Uploaded Custom Fonts ({customFonts.length}):</h4>
              <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                {customFonts.map((f, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 bg-gray-50 border border-gray-200 rounded-lg"
                  >
                    <div>
                      <span className="font-bold text-gray-900 block" style={{ fontFamily: f.name }}>
                        {f.name} — أبجد هوز
                      </span>
                      <span className="text-[10px] text-gray-400">{f.fileName}</span>
                    </div>
                    <button
                      onClick={() => onRemoveCustomFont(f.name)}
                      className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Remove font"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

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
            onClick={handleUpload}
            disabled={!fontFile || !fontName.trim() || isProcessing}
            className="flex items-center gap-1.5 bg-[#046a38] hover:bg-emerald-800 disabled:opacity-50 text-white px-5 py-2 rounded-lg text-xs font-bold shadow-md transition-all"
          >
            {isProcessing ? (
              <span>Registering Font...</span>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Add Font to Ribbon</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}

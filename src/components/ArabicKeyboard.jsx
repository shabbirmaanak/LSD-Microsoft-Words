import React from 'react';
import { X, Keyboard } from 'lucide-react';

export default function ArabicKeyboard({ isOpen, onClose, onInsertChar }) {
  if (!isOpen) return null;

  // Lisan al Dawat & Arabic Letters layout
  const rows = [
    // Diacritics row
    [
      { char: 'َ', name: 'Fatha' },
      { char: 'ُ', name: 'Damma' },
      { char: 'ِ', name: 'Kasra' },
      { char: 'ً', name: 'Tanween Fath' },
      { char: 'ٌ', name: 'Tanween Damm' },
      { char: 'ٍ', name: 'Tanween Kasr' },
      { char: 'ّ', name: 'Shadda' },
      { char: 'ْ', name: 'Sukun' },
      { char: 'ٰ', name: 'Dagger Alif' },
      { char: 'ٱ', name: 'Alif Wasla' },
      { char: 'ء', name: 'Hamza' },
      { char: 'أ', name: 'Alif Hamza' },
      { char: 'إ', name: 'Alif Kasra' },
      { char: 'آ', name: 'Alif Madda' },
    ],
    // Top letter row
    [
      { char: 'ض', name: 'Dad' },
      { char: 'ص', name: 'Sad' },
      { char: 'ث', name: 'Tha' },
      { char: 'ق', name: 'Qaf' },
      { char: 'ف', name: 'Fa' },
      { char: 'غ', name: 'Ghain' },
      { char: 'ع', name: 'Ain' },
      { char: 'ه', name: 'Ha' },
      { char: 'خ', name: 'Kha' },
      { char: 'ح', name: 'Haa' },
      { char: 'ج', name: 'Jeem' },
      { char: 'چ', name: 'Che (Lisan Dawat)' },
      { char: 'د', name: 'Dal' },
      { char: 'ذ', name: 'Thal' },
    ],
    // Home row
    [
      { char: 'ش', name: 'Sheen' },
      { char: 'س', name: 'Seen' },
      { char: 'ي', name: 'Ya' },
      { char: 'ب', name: 'Ba' },
      { char: 'پ', name: 'Pa (Lisan Dawat)' },
      { char: 'ل', name: 'Lam' },
      { char: 'ا', name: 'Alif' },
      { char: 'ت', name: 'Ta' },
      { char: 'ن', name: 'Noon' },
      { char: 'م', name: 'Meem' },
      { char: 'ك', name: 'Kaf' },
      { char: 'گ', name: 'Gaf (Lisan Dawat)' },
      { char: 'ط', name: 'Taa' },
      { char: 'ظ', name: 'Zaa' },
    ],
    // Bottom row
    [
      { char: 'ئ', name: 'Ya Hamza' },
      { char: 'ء', name: 'Hamza' },
      { char: 'ؤ', name: 'Waw Hamza' },
      { char: 'ر', name: 'Ra' },
      { char: 'ز', name: 'Zay' },
      { char: 'ژ', name: 'Zhe (Lisan Dawat)' },
      { char: 'و', name: 'Waw' },
      { char: 'ة', name: 'Ta Marbuta' },
      { char: 'ى', name: 'Alif Maqsura' },
      { char: 'ﷲ', name: 'Allah' },
      { char: 'ﷺ', name: 'Sallallahu Alaihi Wa Sallam' },
    ],
    // Arabic Numerals row
    [
      { char: '٠', name: '0' },
      { char: '١', name: '1' },
      { char: '٢', name: '2' },
      { char: '٣', name: '3' },
      { char: '٤', name: '4' },
      { char: '٥', name: '5' },
      { char: '٦', name: '6' },
      { char: '٧', name: '7' },
      { char: '٨', name: '8' },
      { char: '٩', name: '9' },
    ]
  ];

  const quickPhrases = [
    { label: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ' },
    { label: 'الحَمْدُ لِلَّهِ رَبِّ العَالَمِينَ', text: 'الحَمْدُ لِلَّهِ رَبِّ العَالَمِينَ' },
    { label: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَآلِ مُحَمَّدٍ', text: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَآلِ مُحَمَّدٍ' },
    { label: 'إن شاء الله', text: 'إن شاء الله' },
    { label: 'الحمد لله', text: 'الحمد لله' },
    { label: 'جزاكم الله خير', text: 'جزاكم الله خير' }
  ];

  return (
    <div className="fixed bottom-0 sm:bottom-12 left-0 sm:left-1/2 sm:-translate-x-1/2 z-50 bg-[#1e293b] text-white rounded-t-xl sm:rounded-xl shadow-2xl p-3 sm:p-4 border border-slate-700 w-full sm:max-w-3xl max-h-[85vh] overflow-y-auto select-none arabic-keyboard-modal animate-in fade-in slide-in-from-bottom-5 duration-150">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <Keyboard className="w-4 h-4 sm:w-5 sm:h-5 text-[#046a38] bg-emerald-100 p-0.5 rounded" />
          <h3 className="font-bold text-xs sm:text-sm text-slate-100 font-serif">
            Lisan al Dawat & Arabic Keyboard
          </h3>
          <span className="text-[9px] sm:text-[10px] bg-emerald-900/80 text-emerald-300 font-semibold px-1.5 py-0.5 rounded border border-emerald-700/50">
            لسان الدعوة
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Calligraphy Phrases */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-2 text-xs border-b border-slate-700/60 no-scrollbar">
        <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium whitespace-nowrap">Phrases:</span>
        {quickPhrases.map((phrase, idx) => (
          <button
            key={idx}
            onClick={() => onInsertChar(phrase.text + ' ')}
            className="px-2 py-0.5 bg-slate-800 hover:bg-emerald-800 text-emerald-200 hover:text-white rounded border border-slate-700 font-serif text-xs sm:text-sm transition-all whitespace-nowrap shadow-xs"
          >
            {phrase.label}
          </button>
        ))}
      </div>

      {/* Virtual Keyboard Keys */}
      <div className="space-y-1.5 dir-rtl overflow-x-auto pb-1" dir="rtl">
        {rows.map((row, rIdx) => (
          <div key={rIdx} className="flex justify-center gap-1 min-w-max">
            {row.map((item, kIdx) => (
              <button
                key={kIdx}
                onClick={() => onInsertChar(item.char)}
                title={item.name}
                className={`min-w-[28px] sm:min-w-[34px] h-8 sm:h-9 px-1 rounded flex items-center justify-center font-bold font-serif text-sm sm:text-base transition-all active:scale-95 shadow-xs ${
                  item.char === 'پ' || item.char === 'چ' || item.char === 'ژ' || item.char === 'گ'
                    ? 'bg-amber-700/90 hover:bg-amber-600 text-amber-100 border border-amber-500' // Highlight Lisan al Dawat letters
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 hover:border-slate-500'
                }`}
              >
                {item.char}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Spacebar & Actions */}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-700 text-xs">
        <span className="text-[10px] sm:text-[11px] text-slate-400">
          Orange (<span className="text-amber-300 font-bold">پ, چ, ژ, گ</span>) = Lisan al Dawat
        </span>
        <button
          onClick={() => onInsertChar(' ')}
          className="px-6 sm:px-8 py-1 bg-slate-700 hover:bg-slate-600 font-semibold rounded text-slate-200 shadow-sm transition-colors text-xs"
        >
          Spacebar
        </button>
      </div>

    </div>
  );
}

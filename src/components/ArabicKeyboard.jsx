import React from 'react';
import { X, Keyboard, Sparkles } from 'lucide-react';

export default function ArabicKeyboard({ isOpen, onClose, onInsertChar }) {
  if (!isOpen) return null;

  // Lisan al Dawat Special Bar (Alkanz & Amiri Layouts)
  const lisanDawatSpecialKeys = [
    { char: 'چ', name: 'Che (Alkanz/Amiri: pp / P)' },
    { char: 'گ', name: 'Gaf (Alkanz/Amiri: ;; / K)' },
    { char: 'پ', name: 'Pe (Alkanz/Amiri: ee / u)' },
    { char: 'ے', name: 'Bari Ye (Alkanz/Amiri: ss / y)' },
    { char: 'ھ', name: 'Do-chashmi He (h)' },
    { char: 'چهے', name: 'Chhe (Alkanz: Shift+P / ‘)' },
    { char: 'ٹ', name: 'Tte (qq / t)' },
    { char: 'ں', name: 'Noon Ghunna (ww / N)' },
    { char: 'ژ', name: 'Zhe (Z)' },
    { char: 'ۓ', name: 'Hamza Bari Ye (C)' },
    { char: 'أل', name: 'Alif-Lam (Alkanz)' },
    { char: 'إل', name: 'Alif-Kasra-Lam (Alkanz)' },
    { char: 'لا', name: 'Lam-Alif (b)' },
  ];

  // Exact Computer QWERTY Keyboard Layout (Left to Right matching physical keys)
  const qwertyRows = [
    // Row 0: Numbers & Diacritics
    [
      { char: '١', sub: '1', name: '1' },
      { char: '٢', sub: '2', name: '2' },
      { char: '٣', sub: '3', name: '3' },
      { char: '٤', sub: '4', name: '4' },
      { char: '٥', sub: '5', name: '5' },
      { char: '٦', sub: '6', name: '6' },
      { char: '٧', sub: '7', name: '7' },
      { char: '٨', sub: '8', name: '8' },
      { char: '٩', sub: '9', name: '9' },
      { char: '٠', sub: '0', name: '0' },
      { char: 'ـ', sub: '-', name: 'Tatweel / Kashida' },
      { char: 'ّ', sub: '~', name: 'Shadda' },
      { char: 'َ', sub: 'Fatha', name: 'Fatha' },
      { char: 'ِ', sub: 'Kasra', name: 'Kasra' },
      { char: 'ُ', sub: 'Damma', name: 'Damma' },
      { char: 'ْ', sub: 'Sukun', name: 'Sukun' },
    ],
    // Row 1: Q W E R T Y U I O P [ ]
    [
      { char: 'ض', sub: 'Q', name: 'Dad (qq = ٹ)' },
      { char: 'ص', sub: 'W', name: 'Sad (ww = ں)' },
      { char: 'ث', sub: 'E', name: 'Tha (ee = پ)' },
      { char: 'ق', sub: 'R', name: 'Qaf' },
      { char: 'ف', sub: 'T', name: 'Fa' },
      { char: 'غ', sub: 'Y', name: 'Ghain' },
      { char: 'ع', sub: 'U', name: 'Ain' },
      { char: 'ه', sub: 'I', name: 'Ha (hh = ھ)' },
      { char: 'خ', sub: 'O', name: 'Kha' },
      { char: 'ح', sub: 'P', name: 'Haa (pp = چ)' },
      { char: 'ج', sub: '[', name: 'Jeem' },
      { char: 'د', sub: ']', name: 'Dal' },
    ],
    // Row 2: A S D F G H J K L ; '
    [
      { char: 'ش', sub: 'A', name: 'Sheen' },
      { char: 'س', sub: 'S', name: 'Seen (ss = ے)' },
      { char: 'ي', sub: 'D', name: 'Ya' },
      { char: 'ب', sub: 'F', name: 'Ba' },
      { char: 'ل', sub: 'G', name: 'Lam' },
      { char: 'ا', sub: 'H', name: 'Alif' },
      { char: 'ت', sub: 'J', name: 'Ta' },
      { char: 'ن', sub: 'K', name: 'Noon' },
      { char: 'م', sub: 'L', name: 'Meem' },
      { char: 'ك', sub: ';', name: 'Kaf (;; = گ)' },
      { char: 'ط', sub: "'", name: "Taa ('' = ں)" },
    ],
    // Row 3: Z X C V B N M , . /
    [
      { char: 'ئ', sub: 'Z', name: 'Ya Hamza (Shift+Z = ژ)' },
      { char: 'ء', sub: 'X', name: 'Hamza' },
      { char: 'ؤ', sub: 'C', name: 'Waw Hamza' },
      { char: 'ر', sub: 'V', name: 'Ra' },
      { char: 'لا', sub: 'B', name: 'Lam-Alif' },
      { char: 'ى', sub: 'N', name: 'Alif Maqsura' },
      { char: 'ة', sub: 'M', name: 'Ta Marbuta' },
      { char: 'و', sub: ',', name: 'Waw' },
      { char: 'ز', sub: '.', name: 'Zay' },
      { char: 'ظ', sub: '/', name: 'Zaa (// = ؍)' },
      { char: 'ﷲ', sub: 'الله', name: 'Allah' },
      { char: 'ﷺ', sub: 'صلى', name: 'Sallallahu Alaihi Wa Sallam' },
    ],
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
    <div className="fixed bottom-0 sm:bottom-12 left-0 sm:left-1/2 sm:-translate-x-1/2 z-50 bg-[#1e293b] text-white rounded-t-xl sm:rounded-xl shadow-2xl p-3 sm:p-4 border border-slate-700 w-full sm:max-w-4xl max-h-[88vh] overflow-y-auto select-none arabic-keyboard-modal animate-in fade-in slide-in-from-bottom-5 duration-150" dir="ltr">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <Keyboard className="w-4 h-4 sm:w-5 sm:h-5 text-[#046a38] bg-emerald-100 p-0.5 rounded" />
          <h3 className="font-bold text-xs sm:text-sm text-slate-100 font-serif">
            Computer QWERTY Layout Keyboard (لسان الدعوة)
          </h3>
          <span className="text-[9px] sm:text-[10px] bg-emerald-900/80 text-emerald-300 font-semibold px-2 py-0.5 rounded border border-emerald-700/50">
            QWERTY Matched
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Dedicated Lisan al Dawat Special Characters Bar */}
      <div className="bg-amber-950/70 border border-amber-600/60 rounded-lg p-2 mb-3">
        <div className="flex items-center gap-1 mb-1.5 text-amber-200 text-[11px] font-bold">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Lisan al Dawat Unique Characters & Ligatures:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {lisanDawatSpecialKeys.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onInsertChar(item.char)}
              title={item.name}
              className="px-2.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-md font-bold font-serif text-base shadow-sm transition-all active:scale-95 border border-amber-400 flex items-center gap-1"
            >
              <span>{item.char}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Calligraphy Phrases */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-2 text-xs border-b border-slate-700/60 no-scrollbar">
        <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium whitespace-nowrap">Calligraphy:</span>
        {quickPhrases.map((phrase, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onInsertChar(phrase.text + ' ')}
            className="px-2 py-0.5 bg-slate-800 hover:bg-emerald-800 text-emerald-200 hover:text-white rounded border border-slate-700 font-serif text-xs sm:text-sm transition-all whitespace-nowrap shadow-xs"
          >
            {phrase.label}
          </button>
        ))}
      </div>

      {/* Virtual Keyboard Keys - EXACT Physical Computer QWERTY Left-to-Right layout */}
      <div className="space-y-1.5 overflow-x-auto pb-1" dir="ltr">
        {qwertyRows.map((row, rIdx) => (
          <div key={rIdx} className="flex justify-center gap-1 min-w-max">
            {row.map((item, kIdx) => (
              <button
                key={kIdx}
                type="button"
                onClick={() => onInsertChar(item.char)}
                title={item.name}
                className="min-w-[32px] sm:min-w-[42px] h-9 sm:h-10 px-1 rounded flex flex-col items-center justify-center transition-all active:scale-95 shadow-xs bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 hover:border-slate-500 group"
              >
                <span className="font-bold font-serif text-sm sm:text-base leading-none">
                  {item.char}
                </span>
                {item.sub && (
                  <span className="text-[8px] sm:text-[9px] text-slate-400 group-hover:text-amber-300 font-mono leading-none mt-0.5">
                    {item.sub}
                  </span>
                )}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Spacebar & Actions */}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-700 text-xs">
        <span className="text-[10px] sm:text-[11px] text-slate-300 font-serif">
          Alkanz/Amiri Mappings: <span className="text-amber-300 font-bold">ss=ے, ee=پ, ;;=گ, pp=چ, qq=ٹ, ww=ں, ‘’=ں, //=؍</span>
        </span>
        <button
          type="button"
          onClick={() => onInsertChar(' ')}
          className="px-6 sm:px-8 py-1 bg-slate-700 hover:bg-slate-600 font-semibold rounded text-slate-200 shadow-sm transition-colors text-xs"
        >
          Spacebar
        </button>
      </div>

    </div>
  );
}

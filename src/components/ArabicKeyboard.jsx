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

  // Mac OS Arabic QWERTY Keyboard Layout rows
  const rows = [
    // Diacritics & Vocalization row
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
      { char: 'أ', name: 'Alif Hamza' },
      { char: 'إ', name: 'Alif Kasra' },
      { char: 'آ', name: 'Alif Madda' },
    ],
    // Mac Arabic QWERTY Row 1: ض ص ث ق ف غ ع ه خ ح ج د
    [
      { char: 'ض', name: 'Dad (Q)' },
      { char: 'ص', name: 'Sad (W)' },
      { char: 'ث', name: 'Tha (E)' },
      { char: 'ق', name: 'Qaf (R)' },
      { char: 'ف', name: 'Fa (T)' },
      { char: 'غ', name: 'Ghain (Y)' },
      { char: 'ع', name: 'Ain (U)' },
      { char: 'ه', name: 'Ha (I)' },
      { char: 'خ', name: 'Kha (O)' },
      { char: 'ح', name: 'Haa (P)' },
      { char: 'ج', name: 'Jeem ([)' },
      { char: 'د', name: 'Dal (])' },
    ],
    // Mac Arabic QWERTY Row 2 (Home): ش س ي ب ل ا ت ن م ك ط
    [
      { char: 'ش', name: 'Sheen (A)' },
      { char: 'س', name: 'Seen (S)' },
      { char: 'ي', name: 'Ya (D)' },
      { char: 'ب', name: 'Ba (F)' },
      { char: 'ل', name: 'Lam (G)' },
      { char: 'ا', name: 'Alif (H)' },
      { char: 'ت', name: 'Ta (J)' },
      { char: 'ن', name: 'Noon (K)' },
      { char: 'م', name: 'Meem (L)' },
      { char: 'ك', name: 'Kaf (;)' },
      { char: 'ط', name: 'Taa (\')' },
    ],
    // Mac Arabic QWERTY Row 3 (Bottom): ئ ء ؤ ر لا ى ة و ز ظ
    [
      { char: 'ئ', name: 'Ya Hamza (Z)' },
      { char: 'ء', name: 'Hamza (X)' },
      { char: 'ؤ', name: 'Waw Hamza (C)' },
      { char: 'ر', name: 'Ra (V)' },
      { char: 'لا', name: 'Lam Alif (B)' },
      { char: 'ى', name: 'Alif Maqsura (N)' },
      { char: 'ة', name: 'Ta Marbuta (M)' },
      { char: 'و', name: 'Waw (,)' },
      { char: 'ز', name: 'Zay (.)' },
      { char: 'ظ', name: 'Zaa (/)' },
      { char: 'ﷲ', name: 'Allah' },
      { char: 'ﷺ', name: 'Sallallahu Alaihi Wa Sallam' },
    ],
    // Numerals
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
    <div className="fixed bottom-0 sm:bottom-12 left-0 sm:left-1/2 sm:-translate-x-1/2 z-50 bg-[#1e293b] text-white rounded-t-xl sm:rounded-xl shadow-2xl p-3 sm:p-4 border border-slate-700 w-full sm:max-w-4xl max-h-[88vh] overflow-y-auto select-none arabic-keyboard-modal animate-in fade-in slide-in-from-bottom-5 duration-150">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <Keyboard className="w-4 h-4 sm:w-5 sm:h-5 text-[#046a38] bg-emerald-100 p-0.5 rounded" />
          <h3 className="font-bold text-xs sm:text-sm text-slate-100 font-serif">
            Lisan al Dawat & Alkanz Layout Keyboard
          </h3>
          <span className="text-[9px] sm:text-[10px] bg-emerald-900/80 text-emerald-300 font-semibold px-2 py-0.5 rounded border border-emerald-700/50">
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

      {/* Dedicated Lisan al Dawat Special Characters Bar */}
      <div className="bg-amber-950/70 border border-amber-600/60 rounded-lg p-2 mb-3">
        <div className="flex items-center gap-1 mb-1.5 text-amber-200 text-[11px] font-bold">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Lisan al Dawat Unique Characters (حروف لسان الدعوة):</span>
        </div>
        <div className="flex flex-wrap gap-1.5 dir-rtl" dir="rtl">
          {lisanDawatSpecialKeys.map((item, idx) => (
            <button
              key={idx}
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
                  item.char === 'پ' || item.char === 'چ' || item.char === 'ژ' || item.char === 'گ' || item.char === 'ے' || item.char === 'ھ' || item.char === 'چهے'
                    ? 'bg-amber-600 hover:bg-amber-500 text-white font-black border border-amber-300' // Highlight Lisan al Dawat letters
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
        <span className="text-[10px] sm:text-[11px] text-slate-300 font-serif">
          Alkanz/Amiri Mappings: <span className="text-amber-300 font-bold">pp=چ, ;;=گ, ee=پ, ss=ے, h=ھ, ‘=چهے</span>
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

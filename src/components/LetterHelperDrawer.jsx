import React, { useState } from 'react';
import { 
  X, Sparkles, User, MapPin, Calendar, Mail, FileText, CheckCircle2, AlertTriangle, ArrowRight, Wand2 
} from 'lucide-react';

export default function LetterHelperDrawer({
  isOpen,
  onClose,
  editorText,
  onInsertBlock
}) {
  const [activeTab, setActiveTab] = useState('autofill');

  // Autofill Form state
  const [senderName, setSenderName] = useState('Eleanor Vance');
  const [senderTitle, setSenderTitle] = useState('Vice President of Operations');
  const [senderCompany, setSenderCompany] = useState('ACME Global Corporation');
  const [senderAddress, setSenderAddress] = useState('100 Corporate Parkway, Suite 400, New York, NY');
  
  const [recipientName, setRecipientName] = useState('Mr. Jonathan Reynolds');
  const [recipientTitle, setRecipientTitle] = useState('Director of Strategic Partnerships');
  const [recipientCompany, setRecipientCompany] = useState('Nexus Enterprise Solutions');
  const [recipientAddress, setRecipientAddress] = useState('500 Innovation Boulevard, San Francisco, CA');

  const [subjectLine, setSubjectLine] = useState('Formal Proposal for Partnership Expansion');
  const [salutation, setSalutation] = useState('Dear Mr. Reynolds,');
  const [signOff, setSignOff] = useState('Sincerely,');

  if (!isOpen) return null;

  // Perform quick structural audit of editor text
  const hasDate = /\b(January|February|March|April|May|June|July|August|September|October|November|December|\d{4})\b/i.test(editorText);
  const hasSubject = /\b(subject|re:)\b/i.test(editorText);
  const hasSalutation = /\b(dear|to whom|hello)\b/i.test(editorText);
  const hasSignoff = /\b(sincerely|regards|respectfully|yours|best)\b/i.test(editorText);
  const hasSender = senderName && editorText.toLowerCase().includes(senderName.toLowerCase());

  const auditScore = [hasDate, hasSubject, hasSalutation, hasSignoff, hasSender].filter(Boolean).length;

  const handleInsertAutofill = () => {
    const todayStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const formattedBlock = `
      <p style="text-align: right;"><strong>${senderCompany}</strong><br>${senderTitle ? senderTitle + '<br>' : ''}${senderAddress}</p>
      <hr>
      <p><strong>Date:</strong> ${todayStr}</p>
      <br>
      <p><strong>To:</strong><br>${recipientName}<br>${recipientTitle ? recipientTitle + '<br>' : ''}${recipientCompany ? recipientCompany + '<br>' : ''}${recipientAddress}</p>
      <br>
      <p><strong>SUBJECT: ${subjectLine.toUpperCase()}</strong></p>
      <br>
      <p>${salutation}</p>
      <p>[Type the main body of your letter here...]</p>
      <br>
      <p>${signOff}</p>
      <br><br>
      <p>___________________________<br><strong>${senderName}</strong><br>${senderTitle}</p>
    `;
    onInsertBlock('custom-html', formattedBlock);
  };

  return (
    <aside className="w-80 bg-white border-l border-gray-300 shadow-xl flex flex-col h-full z-40 select-none no-print animate-in slide-in-from-right duration-200">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-200" />
          <h3 className="font-bold text-sm">Letter Studio Assistant</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/20 rounded transition-colors text-amber-100 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 text-xs font-semibold bg-gray-50">
        <button
          onClick={() => setActiveTab('autofill')}
          className={`flex-1 py-2.5 text-center transition-colors border-b-2 ${
            activeTab === 'autofill'
              ? 'border-amber-600 text-amber-700 bg-white'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          📝 Letter Builder
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`flex-1 py-2.5 text-center transition-colors border-b-2 ${
            activeTab === 'audit'
              ? 'border-amber-600 text-amber-700 bg-white'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          🔍 Audit & Tone
        </button>
      </div>

      {/* Content View */}
      <div className="p-4 overflow-y-auto flex-1 space-y-4 text-xs">
        
        {/* ================= BUILDER TAB ================= */}
        {activeTab === 'autofill' && (
          <div className="space-y-4">
            <p className="text-gray-500 text-[11px] leading-relaxed">
              Fill in the letter details below to auto-generate a perfectly formatted header and envelope layout into your letter.
            </p>

            {/* Sender Section */}
            <div className="space-y-2 border-b border-gray-200 pb-3">
              <h4 className="font-bold text-gray-800 flex items-center gap-1.5 text-xs">
                <User className="w-3.5 h-3.5 text-blue-600" />
                Sender Information
              </h4>
              <input
                type="text"
                placeholder="Full Name"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Job Title / Position"
                value={senderTitle}
                onChange={(e) => setSenderTitle(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Company / Organization"
                value={senderCompany}
                onChange={(e) => setSenderCompany(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Address line"
                value={senderAddress}
                onChange={(e) => setSenderAddress(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            {/* Recipient Section */}
            <div className="space-y-2 border-b border-gray-200 pb-3">
              <h4 className="font-bold text-gray-800 flex items-center gap-1.5 text-xs">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                Recipient Information
              </h4>
              <input
                type="text"
                placeholder="Recipient Full Name"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Recipient Title"
                value={recipientTitle}
                onChange={(e) => setRecipientTitle(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Recipient Organization"
                value={recipientCompany}
                onChange={(e) => setRecipientCompany(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Recipient Address"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            {/* Letter Basics */}
            <div className="space-y-2 pb-2">
              <h4 className="font-bold text-gray-800 flex items-center gap-1.5 text-xs">
                <FileText className="w-3.5 h-3.5 text-purple-600" />
                Subject & Salutation
              </h4>
              <input
                type="text"
                placeholder="Subject Line"
                value={subjectLine}
                onChange={(e) => setSubjectLine(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Salutation"
                  value={salutation}
                  onChange={(e) => setSalutation(e.target.value)}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs"
                />
                <input
                  type="text"
                  placeholder="Sign-off"
                  value={signOff}
                  onChange={(e) => setSignOff(e.target.value)}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs"
                />
              </div>
            </div>

            <button
              onClick={handleInsertAutofill}
              className="w-full py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg font-bold shadow-md flex items-center justify-center gap-2 transition-all"
            >
              <Wand2 className="w-4 h-4" />
              <span>Insert Formatted Header</span>
            </button>
          </div>
        )}

        {/* ================= AUDIT TAB ================= */}
        {activeTab === 'audit' && (
          <div className="space-y-4">
            {/* Score Card */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
              <span className="text-[10px] uppercase font-bold text-amber-700 tracking-wider">Letter Structure Score</span>
              <div className="text-3xl font-black text-amber-800 my-1">
                {auditScore} <span className="text-sm font-normal text-amber-600">/ 5</span>
              </div>
              <p className="text-[11px] text-amber-700 font-medium">
                {auditScore === 5 ? '🎉 Complete professional letter structure!' : 'Checks key formal letter elements.'}
              </p>
            </div>

            {/* Checklist */}
            <div className="space-y-2">
              <h4 className="font-bold text-gray-800 text-xs">Letter Checklist</h4>
              <div className="space-y-1.5">
                {[
                  { label: 'Date Included', status: hasDate },
                  { label: 'Subject Line Present', status: hasSubject },
                  { label: 'Formal Salutation ("Dear...")', status: hasSalutation },
                  { label: 'Professional Sign-Off ("Sincerely...")', status: hasSignoff },
                  { label: 'Sender Signature Name', status: hasSender },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-200/80">
                    <span className="text-gray-700 text-xs">{item.label}</span>
                    {item.status ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Suggestions */}
            <div className="border-t border-gray-200 pt-3">
              <h4 className="font-bold text-gray-800 text-xs mb-2">Tone Guidance</h4>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-[11px] text-blue-900 leading-relaxed space-y-1.5">
                <p><strong>Formal / Corporate:</strong> Maintain clear paragraph breaks, active voice, and explicit call-to-action dates.</p>
                <p><strong>Spacing Tip:</strong> Standard business letters leave 1 to 2 blank lines between paragraphs.</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </aside>
  );
}

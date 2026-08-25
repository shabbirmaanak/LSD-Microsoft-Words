import React, { useState, useEffect, useCallback } from 'react';
import html2pdf from 'html2pdf.js';
import HeaderBar from './components/HeaderBar';
import Ribbon from './components/Ribbon';
import A4EditorCanvas from './components/A4EditorCanvas';
import StatusBar from './components/StatusBar';
import TemplateModal from './components/TemplateModal';
import LetterHelperDrawer from './components/LetterHelperDrawer';
import SavedDocsModal from './components/SavedDocsModal';
import ArabicKeyboard from './components/ArabicKeyboard';
import FontUploadModal from './components/FontUploadModal';
import FontManagerModal from './components/FontManagerModal';
import { letterTemplates } from './data/letterTemplates';
import { preinstalledFonts, loadLocalFontsFolder } from './config/defaultFonts';

export default function App() {
  // Document State
  const [docId, setDocId] = useState('doc_' + Date.now());
  const [docTitle, setDocTitle] = useState('Formal Business Proposal Letter.docx');
  const [content, setContent] = useState(letterTemplates.find(t => t.id === 'formal-business')?.content || letterTemplates[0].content);
  const [editorText, setEditorText] = useState('');
  const [editorInstance, setEditorInstance] = useState(null);

  // Layout & Language Settings
  const [textDirection, setTextDirection] = useState('ltr');
  const [watermark, setWatermark] = useState('');
  const [margins, setMargins] = useState('normal');
  const [orientation, setOrientation] = useState('portrait');
  const [paperColor, setPaperColor] = useState('#ffffff');
  const [zoomLevel, setZoomLevel] = useState(100);

  // Custom & Active Fonts State
  const [customFonts, setCustomFonts] = useState([]);
  const [activeFontValues, setActiveFontValues] = useState(
    preinstalledFonts.map((f) => f.value)
  );

  // Modals & Drawers
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [isHelperOpen, setIsHelperOpen] = useState(false);
  const [isArabicKeyboardOpen, setIsArabicKeyboardOpen] = useState(false);
  const [isFontUploadModalOpen, setIsFontUploadModalOpen] = useState(false);
  const [isFontManagerModalOpen, setIsFontManagerModalOpen] = useState(false);

  // Auto-Save & Storage
  const [isSaving, setIsSaving] = useState(false);
  const [savedLetters, setSavedLetters] = useState([]);

  // Combine Pre-installed Fonts + Custom Uploaded Fonts
  const allAvailableFonts = [
    ...customFonts.map((cf) => ({ name: `✨ ${cf.name} (Custom)`, value: `${cf.name}, sans-serif` })),
    ...preinstalledFonts
  ];

  // Load Custom Uploaded Fonts, Active Fonts List & Saved Letters on Mount
  useEffect(() => {
    // 1. Load Preinstalled Local Fonts
    loadLocalFontsFolder();

    // 2. Load Saved Letters
    try {
      const stored = localStorage.getItem('word_letters_studio_saved');
      if (stored) setSavedLetters(JSON.parse(stored));
    } catch (e) {
      console.error('Failed to load saved letters', e);
    }

    // 3. Load Active Font List Preference
    try {
      const storedActiveFonts = localStorage.getItem('word_letters_active_fonts');
      if (storedActiveFonts) {
        const parsed = JSON.parse(storedActiveFonts);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const validValues = preinstalledFonts.map((f) => f.value);
          const filtered = parsed.filter((v) => validValues.includes(v) || v.includes('Custom'));
          setActiveFontValues(filtered.length > 0 ? filtered : validValues);
        }
      }
    } catch (e) {
      console.error('Failed to load active font list', e);
    }

    // 4. Load & Re-Register Custom Fonts
    try {
      const storedFonts = localStorage.getItem('word_letters_custom_fonts');
      if (storedFonts) {
        const fontsArray = JSON.parse(storedFonts);
        setCustomFonts(fontsArray);
        
        fontsArray.forEach(async (fontObj) => {
          try {
            const res = await fetch(fontObj.base64Data);
            const arrayBuffer = await res.arrayBuffer();
            const fontFace = new FontFace(fontObj.name, arrayBuffer);
            const loadedFace = await fontFace.load();
            document.fonts.add(loadedFace);
          } catch (err) {
            console.error('Error restoring font:', fontObj.name, err);
          }
        });
      }
    } catch (e) {
      console.error('Failed to load custom fonts', e);
    }
  }, []);

  // Save Active Fonts Preference
  const handleSaveActiveFonts = (newList) => {
    setActiveFontValues(newList);
    try {
      localStorage.setItem('word_letters_active_fonts', JSON.stringify(newList));
    } catch (e) {
      console.error('Failed to save active fonts to localStorage', e);
    }
  };

  // Add Custom Uploaded Font
  const handleAddCustomFont = (fontObj) => {
    const fontVal = `${fontObj.name}, sans-serif`;
    setCustomFonts((prev) => {
      const updated = [fontObj, ...prev.filter((f) => f.name !== fontObj.name)];
      try {
        localStorage.setItem('word_letters_custom_fonts', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save font to localStorage', e);
      }
      return updated;
    });

    if (!activeFontValues.includes(fontVal)) {
      handleSaveActiveFonts([fontVal, ...activeFontValues]);
    }
  };

  // Remove Custom Font
  const handleRemoveCustomFont = (fontName) => {
    const fontVal = `${fontName}, sans-serif`;
    setCustomFonts((prev) => {
      const filtered = prev.filter((f) => f.name !== fontName);
      localStorage.setItem('word_letters_custom_fonts', JSON.stringify(filtered));
      return filtered;
    });
    setActiveFontValues((prev) => prev.filter((v) => v !== fontVal));
  };

  // Debounced auto-save every 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (content && content.length > 20) {
        handleSave();
      }
    }, 4000);
    return () => clearTimeout(timer);
  }, [content, docTitle, handleSave]);

  // Track Content changes from Tiptap Editor
  const handleContentChange = (html, text) => {
    setContent(html);
    setEditorText(text);
  };

  // Export to PDF using html2pdf
  const handleExportPDF = () => {
    const element = document.getElementById('letter-paper-canvas');
    if (!element) return;

    const opt = {
      margin:       0.3,
      filename:     docTitle.replace(/\.(docx|doc|txt)$/i, '') + '.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, logging: false },
      jsPDF:        { unit: 'in', format: 'a4', orientation: orientation }
    };

    html2pdf().set(opt).from(element).save();
  };

  // Browser Print
  const handlePrint = () => {
    window.print();
  };

  // Create New Letter
  const handleNewLetter = () => {
    const newId = 'doc_' + Date.now();
    setDocId(newId);
    setDocTitle('Untitled Letter.docx');
    setContent('<p>Dear Recipient,</p><br><p>[Type your letter body here...]</p><br><p>Sincerely,</p><br><p><strong>[Your Name]</strong></p>');
    setWatermark('');
    setTextDirection('ltr');
  };

  // Select Template
  const handleSelectTemplate = (template) => {
    setDocTitle(template.title + '.docx');
    setContent(template.content);
    if (template.watermark) {
      setWatermark(template.watermark);
    }
    if (template.category.includes('Lisan') || template.category.includes('Arabic')) {
      setTextDirection('rtl');
    } else {
      setTextDirection('ltr');
    }
  };

  // Load Saved Letter
  const handleLoadLetter = (doc) => {
    setDocId(doc.id);
    setDocTitle(doc.title);
    setContent(doc.content);
    if (doc.watermark) setWatermark(doc.watermark);
    if (doc.margins) setMargins(doc.margins);
    if (doc.paperColor) setPaperColor(doc.paperColor);
    if (doc.textDirection) setTextDirection(doc.textDirection);
  };

  // Delete Saved Letter
  const handleDeleteLetter = (idToDelete) => {
    setSavedLetters((prev) => {
      const filtered = prev.filter((d) => d.id !== idToDelete);
      localStorage.setItem('word_letters_studio_saved', JSON.stringify(filtered));
      return filtered;
    });
  };

  // Insert Quick Date
  const handleInsertDate = () => {
    if (!editorInstance) return;
    const dateStr = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', month: 'long', day: 'numeric' 
    });
    editorInstance.chain().focus().insertContent(`<p><strong>Date:</strong> ${dateStr}</p>`).run();
  };

  // Insert Blocks into Editor
  const handleInsertBlock = (type, customHtml) => {
    if (!editorInstance) return;

    if (customHtml) {
      editorInstance.chain().focus().insertContent(customHtml).run();
      return;
    }

    if (type === 'bismillah') {
      editorInstance.chain().focus().insertContent('<p class="bismillah-header">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>').run();
    } else if (type === 'sender') {
      editorInstance.chain().focus().insertContent(`
        <p style="text-align: right;"><strong>ACME Global Corporation</strong><br>100 Corporate Parkway<br>New York, NY 10001</p>
      `).run();
    } else if (type === 'template-formal') {
      const t = letterTemplates.find(x => x.id === 'formal-business');
      if (t) handleSelectTemplate(t);
    } else if (type === 'template-lisan-arzi') {
      const t = letterTemplates.find(x => x.id === 'lisan-dawat-arzi');
      if (t) handleSelectTemplate(t);
    } else if (type === 'template-lisan-business') {
      const t = letterTemplates.find(x => x.id === 'lisan-dawat-business');
      if (t) handleSelectTemplate(t);
    }
  };

  // Insert Character from Virtual Keyboard
  const handleInsertChar = (char) => {
    if (!editorInstance) return;
    editorInstance.chain().focus().insertContent(char).run();
  };

  // Word & Character count calculations
  const wordCount = editorText ? editorText.trim().split(/\s+/).filter(Boolean).length : 0;
  const charCount = editorText ? editorText.length : 0;

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-100 font-office" dir="ltr">
      
      {/* 1. Top Header Bar */}
      <HeaderBar
        docTitle={docTitle}
        setDocTitle={setDocTitle}
        isSaving={isSaving}
        onSave={handleSave}
        onOpenSavedModal={() => setIsSavedModalOpen(true)}
        onOpenTemplateModal={() => setIsTemplateModalOpen(true)}
        onExportPDF={handleExportPDF}
        onPrint={handlePrint}
        onToggleHelperDrawer={() => setIsHelperOpen(!isHelperOpen)}
        isHelperOpen={isHelperOpen}
      />

      {/* 2. Office Ribbon Toolbar */}
      <Ribbon
        editor={editorInstance}
        watermark={watermark}
        setWatermark={setWatermark}
        margins={margins}
        setMargins={setMargins}
        orientation={orientation}
        setOrientation={setOrientation}
        paperColor={paperColor}
        setPaperColor={setPaperColor}
        textDirection={textDirection}
        setTextDirection={setTextDirection}
        allAvailableFonts={allAvailableFonts}
        activeFontValues={activeFontValues}
        onOpenTemplateModal={() => setIsTemplateModalOpen(true)}
        onOpenFontUploadModal={() => setIsFontUploadModalOpen(true)}
        onOpenFontManagerModal={() => setIsFontManagerModalOpen(true)}
        onExportPDF={handleExportPDF}
        onPrint={handlePrint}
        onNewLetter={handleNewLetter}
        onInsertDate={handleInsertDate}
        onInsertBlock={handleInsertBlock}
        onToggleArabicKeyboard={() => setIsArabicKeyboardOpen(!isArabicKeyboardOpen)}
      />

      {/* 3. Main Workspace: A4 Editor Viewport + Helper Drawer */}
      <div className="flex-1 flex overflow-hidden relative">
        <A4EditorCanvas
          content={content}
          onContentChange={handleContentChange}
          watermark={watermark}
          margins={margins}
          orientation={orientation}
          paperColor={paperColor}
          textDirection={textDirection}
          zoomLevel={zoomLevel}
          setEditorInstance={setEditorInstance}
        />

        <LetterHelperDrawer
          isOpen={isHelperOpen}
          onClose={() => setIsHelperOpen(false)}
          editorText={editorText}
          onInsertBlock={handleInsertBlock}
        />

        {/* On-Screen Arabic & Lisan al Dawat Virtual Keyboard */}
        <ArabicKeyboard
          isOpen={isArabicKeyboardOpen}
          onClose={() => setIsArabicKeyboardOpen(false)}
          onInsertChar={handleInsertChar}
        />
      </div>

      {/* 4. Bottom Status Bar */}
      <StatusBar
        wordCount={wordCount}
        charCount={charCount}
        zoomLevel={zoomLevel}
        setZoomLevel={setZoomLevel}
      />

      {/* Modals */}
      <TemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSelectTemplate={handleSelectTemplate}
      />

      <SavedDocsModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        savedLetters={savedLetters}
        onLoadLetter={handleLoadLetter}
        onDeleteLetter={handleDeleteLetter}
        onNewLetter={handleNewLetter}
      />

      <FontUploadModal
        isOpen={isFontUploadModalOpen}
        onClose={() => setIsFontUploadModalOpen(false)}
        customFonts={customFonts}
        onAddCustomFont={handleAddCustomFont}
        onRemoveCustomFont={handleRemoveCustomFont}
      />

      <FontManagerModal
        isOpen={isFontManagerModalOpen}
        onClose={() => setIsFontManagerModalOpen(false)}
        allAvailableFonts={allAvailableFonts}
        activeFontValues={activeFontValues}
        onSaveActiveFonts={handleSaveActiveFonts}
        customFonts={customFonts}
        onOpenFontUploadModal={() => setIsFontUploadModalOpen(true)}
      />

    </div>
  );
}

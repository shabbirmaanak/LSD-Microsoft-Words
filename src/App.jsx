import React, { useState, useEffect, useCallback } from 'react';
import mammoth from 'mammoth';
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
import AdminCMSModal from './components/AdminCMSModal';
import { letterTemplates } from './data/letterTemplates';
import { preinstalledFonts } from './config/defaultFonts';
import { subscribeToCloudTemplates, isFirebaseConnected } from './services/firebase';
import { isTursoConnected, fetchTursoTemplates } from './services/turso';

export default function App() {
  // Document State
  const [docId, setDocId] = useState('doc_' + Date.now());
  const [docTitle, setDocTitle] = useState('Document1.docx');
  const [content, setContent] = useState('<p></p>');
  const [editorText, setEditorText] = useState('');
  const [editorInstance, setEditorInstance] = useState(null);

  // Custom Templates & Admin Panel State
  const [customTemplates, setCustomTemplates] = useState(() => {
    try {
      const stored = localStorage.getItem('word_letters_custom_templates');
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Failed to initialize custom templates', e);
    }
    return letterTemplates;
  });
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Layout & Language Settings
  const [textDirection, setTextDirection] = useState('ltr');
  const [watermark, setWatermark] = useState('');
  const [margins, setMargins] = useState('normal');
  const [orientation, setOrientation] = useState('portrait');
  const [pageSize, setPageSize] = useState('A4');
  const [totalPages, setTotalPages] = useState(1);
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

  // Load Custom Uploaded Fonts & Saved Letters safely on Mount
  useEffect(() => {
    // 0. Check secret URL route /admin or ?admin=true for Admin CMS Studio
    const isPathAdmin = window.location.pathname === '/admin';
    const isQueryAdmin = window.location.search.includes('admin=true');
    if (isPathAdmin || isQueryAdmin) {
      setIsAdminOpen(true);
    }

    // 1. Load Custom Published Templates
    try {
      const storedTpls = localStorage.getItem('word_letters_custom_templates');
      if (storedTpls !== null) {
        const parsed = JSON.parse(storedTpls);
        if (Array.isArray(parsed)) {
          setCustomTemplates(parsed);
        }
      }
    } catch (e) {
      console.warn('Failed to load custom templates', e);
    }

    // 2. Load Saved Letters
    try {
      const stored = localStorage.getItem('word_letters_studio_saved');
      if (stored) setSavedLetters(JSON.parse(stored));
    } catch (e) {
      console.warn('Failed to load saved letters', e);
    }

    // 2. Load Active Font List Preference
    try {
      const storedActiveFonts = localStorage.getItem('word_letters_active_fonts');
      if (storedActiveFonts) {
        const parsed = JSON.parse(storedActiveFonts);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const validValues = preinstalledFonts.map((f) => f.value);
          const filtered = parsed.filter((v) => validValues.includes(v) || v.includes('Custom'));
          if (filtered.length > 0) setActiveFontValues(filtered);
        }
      }
    } catch (e) {
      console.warn('Failed to load active font list', e);
    }

    // 3. Load & Re-Register Custom Uploaded Fonts
    try {
      const storedFonts = localStorage.getItem('word_letters_custom_fonts');
      if (storedFonts) {
        const fontsArray = JSON.parse(storedFonts);
        setCustomFonts(fontsArray);
        
        fontsArray.forEach(async (fontObj) => {
          try {
            if (fontObj.name && fontObj.base64Data) {
              const res = await fetch(fontObj.base64Data);
              const arrayBuffer = await res.arrayBuffer();
              const fontFace = new FontFace(fontObj.name, arrayBuffer);
              const loadedFace = await fontFace.load();
              document.fonts.add(loadedFace);
            }
          } catch (err) {
            console.warn('Error restoring font:', fontObj.name, err);
          }
        });
      }
    } catch (e) {
      console.warn('Failed to load custom fonts', e);
    }

    // 4. Real-Time Cloud Firestore Sync
    const unsubscribeCloud = subscribeToCloudTemplates((cloudTpls) => {
      if (Array.isArray(cloudTpls) && cloudTpls.length > 0) {
        setCustomTemplates(cloudTpls);
        try {
          localStorage.setItem('word_letters_custom_templates', JSON.stringify(cloudTpls));
        } catch (e) {
          console.warn('Failed to cache cloud templates', e);
        }
      }
    });

    // 5. Turso Cloud Edge Database Sync
    if (isTursoConnected()) {
      fetchTursoTemplates().then((tursoTpls) => {
        if (Array.isArray(tursoTpls) && tursoTpls.length > 0) {
          setCustomTemplates(tursoTpls);
          try {
            localStorage.setItem('word_letters_custom_templates', JSON.stringify(tursoTpls));
          } catch (e) {
            console.warn('Failed to cache Turso templates', e);
          }
        }
      }).catch(err => console.warn('Failed to load Turso templates on mount', err));
    }

    return () => {
      if (typeof unsubscribeCloud === 'function') {
        unsubscribeCloud();
      }
    };
  }, []);

  // Handle Global Ctrl+P / Cmd+P Print shortcut
  useEffect(() => {
    const handlePrintShortcut = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        window.print();
      }
    };
    window.addEventListener('keydown', handlePrintShortcut);
    return () => window.removeEventListener('keydown', handlePrintShortcut);
  }, []);

  // Save Active Fonts Preference
  const handleSaveActiveFonts = (newList) => {
    setActiveFontValues(newList);
    try {
      localStorage.setItem('word_letters_active_fonts', JSON.stringify(newList));
    } catch (e) {
      console.warn('Failed to save active fonts', e);
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
        console.warn('Failed to save font to localStorage', e);
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
      try {
        localStorage.setItem('word_letters_custom_fonts', JSON.stringify(filtered));
      } catch (e) {
        console.warn('Error deleting custom font', e);
      }
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
  }, [content, docTitle]);

  const handleSave = useCallback(() => {
    setIsSaving(true);
    const wordCount = editorText ? editorText.trim().split(/\s+/).filter(Boolean).length : 0;
    
    const updatedDoc = {
      id: docId,
      title: docTitle,
      content,
      watermark,
      margins,
      textDirection,
      paperColor,
      wordCount,
      updatedAt: new Date().toISOString()
    };

    setSavedLetters((prev) => {
      const existingIdx = prev.findIndex((d) => d.id === docId);
      let newArray;
      if (existingIdx >= 0) {
        newArray = [...prev];
        newArray[existingIdx] = updatedDoc;
      } else {
        newArray = [updatedDoc, ...prev];
      }
      try {
        localStorage.setItem('word_letters_studio_saved', JSON.stringify(newArray));
      } catch (e) {
        console.warn('Error writing localStorage', e);
      }
      return newArray;
    });

    setTimeout(() => {
      setIsSaving(false);
    }, 600);
  }, [docId, docTitle, content, watermark, margins, textDirection, paperColor, editorText]);

  // Track Content changes from Tiptap Editor
  const handleContentChange = (html, text) => {
    setContent(html);
    setEditorText(text);
  };

  // Export to PDF safely with dynamic import (Direct Print Ready)
  const handleExportPDF = async () => {
    const element = document.getElementById('letter-paper-canvas');
    if (!element) return;

    try {
      const html2pdfModule = (await import('html2pdf.js')).default;
      const opt = {
        margin:       [10, 10, 10, 10],
        filename:     (docTitle || 'document').replace(/\.(docx|doc|txt)$/i, '') + '.pdf',
        image:        { type: 'jpeg', quality: 0.99 },
        html2canvas:  { scale: 2, useCORS: true, logging: false, letterRendering: true, scrollY: 0 },
        pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] },
        jsPDF:        { unit: 'mm', format: (pageSize || 'a4').toLowerCase(), orientation: orientation || 'portrait' }
      };

      await html2pdfModule().set(opt).from(element).save();
    } catch (err) {
      console.error('PDF export failed, falling back to system print:', err);
      window.print();
    }
  };

  // Browser Print
  const handlePrint = () => {
    window.print();
  };

  // Create New Letter
  const handleNewLetter = () => {
    const newId = 'doc_' + Date.now();
    setDocId(newId);
    setDocTitle('Document1.docx');
    setContent('<p></p>');
    setWatermark('');
    setTextDirection('ltr');
  };

  // Select Template
  const handleSelectTemplate = (template) => {
    setDocId('doc_' + Date.now());
    setDocTitle(template.title + '.docx');
    setContent(template.content);
    if (template.watermark) {
      setWatermark(template.watermark);
    }
    if (template.category && (template.category.includes('Lisan') || template.category.includes('Arabic'))) {
      setTextDirection('rtl');
    } else {
      setTextDirection('ltr');
    }
  };

  // Import Word (.docx) Document Directly into Editor
  const handleImportDOCX = async (file) => {
    if (!file) return;
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      let html = result.value;

      // Auto-detect if content contains Arabic / Lisan al Dawat / Urdu / Persian characters
      const hasRTLChars = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(html);

      if (hasRTLChars) {
        setTextDirection('rtl');
        html = html.replace(/<table(?![^>]*dir=)/gi, '<table dir="rtl"');
      } else {
        setTextDirection('ltr');
      }

      const cleanTitle = file.name.toLowerCase().endsWith('.docx')
        ? file.name
        : `${file.name}.docx`;

      setDocId('doc_' + Date.now());
      setDocTitle(cleanTitle);
      setContent(html);
    } catch (err) {
      alert('Error importing DOCX document: ' + err.message);
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
      try {
        localStorage.setItem('word_letters_studio_saved', JSON.stringify(filtered));
      } catch (e) {
        console.warn('Failed to delete saved letter', e);
      }
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

  // Export as Native Editable Word Document (.docx)
  const handleExportDOCX = () => {
    const paperElement = document.getElementById('letter-paper-canvas');
    if (!paperElement) return;

    const isLandscape = orientation === 'landscape';
    const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>${docTitle || 'Document'}</title>
      <style>
        @page {
          size: ${isLandscape ? 'A4 landscape' : 'A4 portrait'};
          margin: 1in;
        }
        body {
          font-family: Arial, sans-serif;
          direction: ${textDirection};
        }
        table { border-collapse: collapse; width: 100%; margin: 12px 0; }
        td, th { border: 1px solid #ccc; padding: 8px; vertical-align: top; }
        img { max-width: 100%; height: auto; }
      </style>
    </head>
    <body>`;
    const footer = `</body></html>`;
    const html = header + paperElement.innerHTML + footer;

    const blob = new Blob(['\ufeff' + html], {
      type: 'application/msword'
    });

    const fileName = docTitle.toLowerCase().endsWith('.docx') || docTitle.toLowerCase().endsWith('.doc')
      ? docTitle
      : `${docTitle}.docx`;

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
        onExportDOCX={handleExportDOCX}
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
        pageSize={pageSize}
        setPageSize={setPageSize}
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
        onExportDOCX={handleExportDOCX}
        onImportDOCX={handleImportDOCX}
        onPrint={handlePrint}
        onNewLetter={handleNewLetter}
        onInsertDate={handleInsertDate}
        onInsertBlock={handleInsertBlock}
        onToggleArabicKeyboard={() => setIsArabicKeyboardOpen(!isArabicKeyboardOpen)}
      />

      {/* 3. Main Workspace: A4 Editor Viewport + Helper Drawer */}
      <div className="flex-1 flex overflow-hidden relative">
        <A4EditorCanvas
          key={docId}
          content={content}
          onContentChange={handleContentChange}
          watermark={watermark}
          margins={margins}
          orientation={orientation}
          pageSize={pageSize}
          onPageCountChange={setTotalPages}
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
        totalPages={totalPages}
        pageSize={pageSize}
      />

      {/* Modals */}
      <TemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSelectTemplate={handleSelectTemplate}
        templates={customTemplates}
        onImportDOCX={handleImportDOCX}
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

      {/* Secret Admin CMS Modal */}
      <AdminCMSModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        templates={customTemplates}
        onSaveTemplates={(newTpls) => {
          setCustomTemplates(newTpls);
          try {
            localStorage.setItem('word_letters_custom_templates', JSON.stringify(newTpls));
          } catch (e) {
            console.warn('Failed to save templates', e);
          }
        }}
        onResetDefaultTemplates={() => {
          setCustomTemplates(letterTemplates);
          try {
            localStorage.setItem('word_letters_custom_templates', JSON.stringify(letterTemplates));
          } catch (e) {
            console.warn('Failed to reset templates', e);
          }
        }}
        customFonts={customFonts}
        onAddCustomFont={handleAddCustomFont}
        onRemoveCustomFont={handleRemoveCustomFont}
      />

    </div>
  );
}

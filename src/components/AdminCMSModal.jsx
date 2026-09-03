import React, { useState, useEffect } from 'react';
import mammoth from 'mammoth';
import { 
  ShieldCheck, 
  Lock, 
  Plus, 
  Trash2, 
  Type, 
  LayoutTemplate, 
  X, 
  KeyRound,
  Sparkles,
  FileUp,
  FileText,
  CheckCircle2,
  UploadCloud
} from 'lucide-react';

export default function AdminCMSModal({
  isOpen,
  onClose,
  templates = [],
  onSaveTemplates,
  onResetDefaultTemplates,
  customFonts = [],
  onAddCustomFont,
  onRemoveCustomFont
}) {
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [activeTab, setActiveTab] = useState('templates');

  // Form states for adding new template
  const [newTplTitle, setNewTplTitle] = useState('');
  const [newTplCategory, setNewTplCategory] = useState('Official');
  const [newTplDescription, setNewTplDescription] = useState('');
  const [newTplContent, setNewTplContent] = useState('');
  const [isParsingDocx, setIsParsingDocx] = useState(false);
  const [docxSuccessMsg, setDocxSuccessMsg] = useState('');

  // Handle DOCX Template File Upload & Conversion
  const handleDocxUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.docx')) {
      alert('Please select a valid Microsoft Word (.docx) file.');
      return;
    }

    setIsParsingDocx(true);
    setDocxSuccessMsg('');

    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      const extractedHtml = result.value;

      const rawTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      const cleanTitle = rawTitle.charAt(0).toUpperCase() + rawTitle.slice(1);

      setNewTplTitle(cleanTitle);
      setNewTplContent(extractedHtml);
      setNewTplDescription(`Imported from Word template (${file.name})`);
      setDocxSuccessMsg(`Successfully extracted template from "${file.name}"!`);
    } catch (err) {
      alert('Failed to parse DOCX file: ' + err.message);
    } finally {
      setIsParsingDocx(false);
    }
  };

  if (!isOpen) return null;

  const handleLogin = (e) => {
    e.preventDefault();
    // Default secret passcode
    if (passcode === 'admin123' || passcode === 'al-kitabah-admin') {
      setIsAuthenticated(true);
      setAuthError(false);
      sessionStorage.setItem('word_letters_admin_auth', 'true');
    } else {
      setAuthError(true);
    }
  };

  const handleCreateTemplate = (e) => {
    e.preventDefault();
    if (!newTplTitle.trim() || !newTplContent.trim()) return;

    const newTemplate = {
      id: 'tpl_' + Date.now(),
      title: newTplTitle.trim(),
      category: newTplCategory,
      description: newTplDescription.trim() || 'Custom Admin Template',
      content: newTplContent
    };

    const updated = [newTemplate, ...templates];
    onSaveTemplates(updated);

    // Reset form
    setNewTplTitle('');
    setNewTplDescription('');
    setNewTplContent('');
    alert('✅ Template created and published successfully!');
  };

  const handleDeleteTemplate = (id) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      const updated = templates.filter(t => t.id !== id);
      onSaveTemplates(updated);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 no-print animate-fade-in select-none">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="bg-amber-500 text-slate-950 p-1.5 rounded-lg font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base tracking-wide flex items-center gap-2">
                <span>al-kitābah CMS Admin Studio</span>
                <span className="bg-amber-500/20 text-amber-300 text-[10px] uppercase font-mono px-2 py-0.5 rounded border border-amber-500/30">Secret Access</span>
              </h2>
              <p className="text-xs text-slate-400">Manage templates, typography, and system presets without public visibility</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        {!isAuthenticated ? (
          /* Login Screen */
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center max-w-md mx-auto my-auto">
            <div className="bg-slate-100 p-4 rounded-full text-slate-700 mb-4">
              <Lock className="w-8 h-8 text-slate-800" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Restricted Admin Authentication</h3>
            <p className="text-xs text-gray-500 mb-6">Enter the administrative secret passcode to manage templates & platform configurations.</p>

            <form onSubmit={handleLogin} className="w-full space-y-4">
              <div>
                <input
                  type="text"
                  name="admin_cms_pin"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  placeholder="Enter Secret Passcode (e.g. admin123)"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  autoFocus
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 font-mono text-center tracking-widest bg-gray-50 text-gray-900"
                  style={{ WebkitTextSecurity: 'disc' }}
                />
                {authError && (
                  <p className="text-xs text-red-600 font-semibold mt-1.5">❌ Incorrect admin passcode. Please try again.</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <KeyRound className="w-4 h-4 text-amber-400" />
                <span>Authenticate & Access CMS</span>
              </button>
            </form>
          </div>
        ) : (
          /* Admin Dashboard */
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-slate-50">
            {/* Nav Tabs */}
            <div className="bg-white border-b border-gray-200 px-6 py-2 flex items-center space-x-2">
              <button
                onClick={() => setActiveTab('templates')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'templates'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <LayoutTemplate className="w-4 h-4 text-amber-400" />
                <span>Template Manager ({templates.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('fonts')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'fonts'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Type className="w-4 h-4 text-blue-400" />
                <span>Custom Fonts ({customFonts.length})</span>
              </button>
            </div>

            {/* Tab Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* 1. TEMPLATE MANAGER TAB */}
              {activeTab === 'templates' && (
                <div className="space-y-6">
                  
                  {/* Create New Template Card */}
                  <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2 flex-wrap gap-2">
                      <h4 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                        <Plus className="w-4 h-4 text-emerald-600" />
                        <span>Create & Publish New Document Template</span>
                      </h4>

                      {/* Direct DOCX File Upload Button */}
                      <label className="bg-[#106ebe] hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-lg font-bold text-xs shadow-xs cursor-pointer transition-colors flex items-center gap-1.5">
                        <FileUp className="w-4 h-4 text-blue-200" />
                        <span>{isParsingDocx ? 'Converting DOCX...' : 'Upload Word (.docx) Template'}</span>
                        <input
                          type="file"
                          accept=".docx"
                          className="hidden"
                          onChange={handleDocxUpload}
                          disabled={isParsingDocx}
                        />
                      </label>
                    </div>

                    {/* DOCX Upload Info Banner */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50/70 border border-blue-200/80 p-3.5 rounded-xl flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="bg-[#106ebe] text-white p-2 rounded-lg shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-blue-950">Have a Microsoft Word (.docx) letter template file?</p>
                          <p className="text-[11px] text-blue-800/80">Click the button on the right to upload any .docx file. It will automatically extract formatting, paragraphs, and tables!</p>
                        </div>
                      </div>

                      <label className="bg-white hover:bg-blue-50 text-[#106ebe] border border-blue-300 px-3 py-1.5 rounded-lg font-bold text-xs shadow-2xs cursor-pointer transition-colors shrink-0 flex items-center gap-1">
                        <UploadCloud className="w-3.5 h-3.5" />
                        <span>Choose .DOCX</span>
                        <input
                          type="file"
                          accept=".docx"
                          className="hidden"
                          onChange={handleDocxUpload}
                          disabled={isParsingDocx}
                        />
                      </label>
                    </div>

                    {docxSuccessMsg && (
                      <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 animate-fade-in">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{docxSuccessMsg}</span>
                      </div>
                    )}

                    <form onSubmit={handleCreateTemplate} className="space-y-3 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                          <label className="block text-gray-700 font-semibold mb-1">Template Title *</label>
                          <input
                            type="text"
                            placeholder="e.g. Official Invitation Letter"
                            value={newTplTitle}
                            onChange={(e) => setNewTplTitle(e.target.value)}
                            required
                            className="w-full px-3 py-1.5 border border-gray-300 rounded font-medium focus:ring-1 focus:ring-slate-900"
                          />
                        </div>

                        <div>
                          <label className="block text-gray-700 font-semibold mb-1">Category</label>
                          <select
                            value={newTplCategory}
                            onChange={(e) => setNewTplCategory(e.target.value)}
                            className="w-full px-3 py-1.5 border border-gray-300 rounded font-medium focus:ring-1 focus:ring-slate-900"
                          >
                            <option value="Official">Official</option>
                            <option value="Correspondence">Correspondence</option>
                            <option value="Formal Request">Formal Request</option>
                            <option value="Invitation">Invitation</option>
                            <option value="Certificate">Certificate</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-gray-700 font-semibold mb-1">Short Description</label>
                        <input
                          type="text"
                          placeholder="e.g. Standard Lisan al Dawat formal letter layout"
                          value={newTplDescription}
                          onChange={(e) => setNewTplDescription(e.target.value)}
                          className="w-full px-3 py-1.5 border border-gray-300 rounded font-medium focus:ring-1 focus:ring-slate-900"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 font-semibold mb-1">Template HTML / Text Content *</label>
                        <textarea
                          rows={4}
                          placeholder="Paste HTML or text content for template..."
                          value={newTplContent}
                          onChange={(e) => setNewTplContent(e.target.value)}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded font-mono text-xs focus:ring-1 focus:ring-slate-900"
                        />
                      </div>

                      <button
                        type="submit"
                        className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-lg font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
                        <span>Publish Template to Catalog</span>
                      </button>
                    </form>
                  </div>

                  {/* Published Templates List */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-gray-900">Active Published Templates ({templates.length})</h4>
                        <p className="text-[11px] text-gray-500">Live templates available in the catalog across all user devices.</p>
                      </div>

                      {onResetDefaultTemplates && (
                        <button
                          onClick={() => {
                            if (window.confirm('Reset catalog to the standard original templates?')) {
                              onResetDefaultTemplates();
                            }
                          }}
                          className="text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
                          title="Restore original standard templates"
                        >
                          <span>🔄 Reset to Default Templates</span>
                        </button>
                      )}
                    </div>

                    {templates.length === 0 ? (
                      <div className="bg-white p-8 rounded-xl border border-gray-200 text-center space-y-2">
                        <p className="text-sm font-semibold text-gray-700">No templates currently active</p>
                        <p className="text-xs text-gray-400">Upload a Word (.docx) template above or create one manually to publish it to the catalog.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {templates.map((tpl) => (
                          <div key={tpl.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs flex flex-col justify-between space-y-3">
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-bold text-sm text-gray-900">{tpl.title}</span>
                                <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-semibold">{tpl.category}</span>
                              </div>
                              <p className="text-xs text-gray-500 line-clamp-2">{tpl.description}</p>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                              <span className="text-[10px] text-gray-400 font-mono">ID: {tpl.id}</span>
                              <button
                                onClick={() => handleDeleteTemplate(tpl.id)}
                                className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded transition-colors flex items-center gap-1 font-semibold text-[11px]"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Remove</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* 2. CUSTOM FONTS TAB */}
              {activeTab === 'fonts' && (
                <div className="space-y-4">
                  <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                      <div>
                        <h4 className="font-bold text-sm text-gray-900">Platform Custom Fonts</h4>
                        <p className="text-xs text-gray-500">Upload and manage custom TTF/OTF/WOFF fonts for the entire platform.</p>
                      </div>

                      <label className="bg-blue-700 hover:bg-blue-800 text-white px-3.5 py-2 rounded-lg font-bold text-xs shadow-xs cursor-pointer transition-colors flex items-center gap-1.5">
                        <Type className="w-4 h-4 text-blue-200" />
                        <span>Upload New TTF/OTF Font</span>
                        <input
                          type="file"
                          accept=".ttf,.otf,.woff,.woff2"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;

                            const fontName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
                            const reader = new FileReader();
                            reader.onload = async (event) => {
                              const base64Data = event.target.result;
                              try {
                                const res = await fetch(base64Data);
                                const arrayBuffer = await res.arrayBuffer();
                                const fontFace = new FontFace(fontName, arrayBuffer);
                                const loadedFace = await fontFace.load();
                                document.fonts.add(loadedFace);

                                const newFontObj = {
                                  name: fontName,
                                  base64Data,
                                  format: file.name.split('.').pop().toUpperCase()
                                };

                                if (onAddCustomFont) {
                                  onAddCustomFont(newFontObj);
                                  alert(`✅ Font "${fontName}" uploaded & published successfully!`);
                                }
                              } catch (err) {
                                alert('❌ Error loading font file: ' + err.message);
                              }
                            };
                            reader.readAsDataURL(file);
                          }}
                        />
                      </label>
                    </div>
                    
                    {customFonts.length === 0 ? (
                      <p className="text-xs text-gray-400 italic">No custom fonts uploaded yet. Click "Upload New TTF/OTF Font" above to publish your first font.</p>
                    ) : (
                      <div className="space-y-2">
                        {customFonts.map((font) => (
                          <div key={font.name} className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200">
                            <div>
                              <span className="font-bold text-sm text-gray-900" style={{ fontFamily: font.name }}>{font.name}</span>
                              <p className="text-[10px] text-gray-500 font-mono">Format: {font.format || 'TTF'}</p>
                            </div>
                            <button
                              onClick={() => onRemoveCustomFont(font.name)}
                              className="text-red-600 hover:text-red-800 p-1.5 hover:bg-red-100 rounded transition-colors"
                              title="Delete Font"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
}

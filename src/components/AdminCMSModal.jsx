import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Plus, 
  Trash2, 
  Type, 
  LayoutTemplate, 
  X, 
  KeyRound,
  Sparkles
} from 'lucide-react';

export default function AdminCMSModal({
  isOpen,
  onClose,
  templates = [],
  onSaveTemplates,
  customFonts = [],
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

  // Check cached admin auth
  useEffect(() => {
    const cachedAuth = sessionStorage.getItem('word_letters_admin_auth');
    if (cachedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

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
                  type="password"
                  placeholder="Enter Secret Passcode (e.g. admin123)"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  autoFocus
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 font-mono text-center tracking-wider"
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
                    <h4 className="font-bold text-sm text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
                      <Plus className="w-4 h-4 text-emerald-600" />
                      <span>Create & Publish New Document Template</span>
                    </h4>

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
                    <h4 className="font-bold text-sm text-gray-900">Active Published Templates</h4>
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
                  </div>

                </div>
              )}

              {/* 2. CUSTOM FONTS TAB */}
              {activeTab === 'fonts' && (
                <div className="space-y-4">
                  <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs">
                    <h4 className="font-bold text-sm text-gray-900 mb-2">Platform Custom Fonts</h4>
                    <p className="text-xs text-gray-500 mb-4">Manage custom TTF/OTF fonts uploaded to the platform.</p>
                    
                    {customFonts.length === 0 ? (
                      <p className="text-xs text-gray-400 italic">No custom fonts uploaded yet. Use the Font Manager in the ribbon to add TTF fonts.</p>
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

import React, { useState } from 'react';
import mammoth from 'mammoth';
import { X, Search, LayoutTemplate, ArrowRight, Check, FileUp } from 'lucide-react';
import { letterTemplates } from '../data/letterTemplates';

export default function TemplateModal({ isOpen, onClose, onSelectTemplate, templates = letterTemplates, onImportDOCX }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isImporting, setIsImporting] = useState(false);

  if (!isOpen) return null;

  const categories = ['All', 'Official', 'Business', 'Careers', 'HR & Personnel', 'Customer & Consumer', 'Academic & Reference', 'Legal', 'Personal'];

  const filteredTemplates = (templates || letterTemplates).filter((t) => {
    const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleDocxFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.docx')) {
      alert('Please select a valid Microsoft Word (.docx) file.');
      return;
    }

    setIsImporting(true);
    try {
      if (onImportDOCX) {
        await onImportDOCX(file);
        onClose();
      } else {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.convertToHtml({ arrayBuffer });
        const html = result.value;
        const title = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        onSelectTemplate({
          title,
          category: 'Imported Word Doc',
          content: html,
          description: `Imported from ${file.name}`
        });
        onClose();
      }
    } catch (err) {
      alert('Error importing DOCX file: ' + err.message);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden border border-gray-200 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#106ebe] to-blue-800 text-white p-4 sm:p-5 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-lg backdrop-blur-md">
              <LayoutTemplate className="w-6 h-6 text-blue-200" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight">Document Templates</h2>
              <p className="text-xs text-blue-100 mt-0.5">
                Choose a structured letter layout or import your own Word (.docx) file directly.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5 shadow-xs">
              <FileUp className="w-4 h-4 text-blue-200" />
              <span>{isImporting ? 'Importing...' : 'Upload Word (.docx)'}</span>
              <input
                type="file"
                accept=".docx"
                className="hidden"
                onChange={handleDocxFile}
                disabled={isImporting}
              />
            </label>

            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors text-blue-100 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search letter templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
            />
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#106ebe] text-white shadow-xs'
                    : 'bg-white text-gray-600 hover:bg-gray-200 border border-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Template Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
          {filteredTemplates.length === 0 ? (
            <div className="col-span-2 py-12 text-center text-gray-500 flex flex-col items-center">
              <LayoutTemplate className="w-12 h-12 text-gray-300 mb-2" />
              <p className="font-semibold text-gray-700">No templates found</p>
              <p className="text-xs text-gray-400 mt-1">Try tweaking your search term or selecting a different category.</p>
            </div>
          ) : (
            filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="group border border-gray-200 hover:border-blue-500 rounded-xl p-4 transition-all hover:shadow-md bg-white flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 text-[#106ebe] border border-blue-100">
                      {template.category}
                    </span>
                    {template.watermark && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                        🏷️ {template.watermark}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-gray-900 text-base mt-2 group-hover:text-[#106ebe] transition-colors">
                    {template.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                    {template.description}
                  </p>

                  {/* Letter Snippet Preview */}
                  <div className="mt-3 p-3 bg-gray-50 border border-gray-200/80 rounded-lg text-[10px] text-gray-600 font-mono h-24 overflow-hidden relative opacity-85 group-hover:opacity-100 transition-opacity">
                    <div dangerouslySetInnerHTML={{ __html: template.content.slice(0, 300) + '...' }} />
                    <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-gray-50 to-transparent"></div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[11px] text-gray-400 font-medium">Standard A4 Format</span>
                  <button
                    onClick={() => {
                      onSelectTemplate(template);
                      onClose();
                    }}
                    className="flex items-center gap-1.5 bg-[#106ebe] hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-sm group-hover:shadow transition-all"
                  >
                    <span>Use Template</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between text-xs text-gray-500">
          <span>Loading a template will replace current document content.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-200 font-medium text-gray-700 transition-colors"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
}

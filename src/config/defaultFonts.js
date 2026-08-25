// Pre-installed Default Fonts Configuration for LSD-Microsoft Word Studio
// Bundled fonts stored directly inside public/fonts/

export const preinstalledFonts = [
  // User's Lisan al Dawat Custom TTF Fonts
  {
    name: 'Al-Fatemi (لسان الدعوة)',
    value: 'Al-Fatemi, Amiri, serif',
    category: 'Lisan al Dawat',
    isPreinstalled: true,
  },
  {
    name: 'Al-Kanz (لسان الدعوة)',
    value: 'Al-Kanz, Amiri, serif',
    category: 'Lisan al Dawat',
    isPreinstalled: true,
  },
  {
    name: 'Kanz-al-Lulu',
    value: 'Kanz-al-Lulu, Amiri, serif',
    category: 'Lisan al Dawat',
    isPreinstalled: true,
  },
  {
    name: 'Kanz-al-Marjaan',
    value: 'Kanz-al-Marjaan, Amiri, serif',
    category: 'Lisan al Dawat',
    isPreinstalled: true,
  },
  {
    name: 'Kanz-al-Yaqoot',
    value: 'Kanz-al-Yaqoot, Amiri, serif',
    category: 'Lisan al Dawat',
    isPreinstalled: true,
  },

  // Arabic & Web Fonts
  {
    name: 'Amiri',
    value: 'Amiri, serif',
    category: 'Lisan al Dawat & Arabic',
    isPreinstalled: true,
  },
  {
    name: 'Scheherazade New (نسخ)',
    value: 'Scheherazade New, serif',
    category: 'Lisan al Dawat & Arabic',
    isPreinstalled: true,
  },
  {
    name: 'Noto Naskh Arabic',
    value: 'Noto Naskh Arabic, serif',
    category: 'Lisan al Dawat & Arabic',
    isPreinstalled: true,
  },
  {
    name: 'Cairo',
    value: 'Cairo, sans-serif',
    category: 'Arabic Modern',
    isPreinstalled: true,
  },
  {
    name: 'Gulzar (نستعليق)',
    value: 'Gulzar, cursive',
    category: 'Nastaliq',
    isPreinstalled: true,
  },

  // Standard Typography
  {
    name: 'Calibri',
    value: 'Calibri, sans-serif',
    category: 'Standard Office',
    isPreinstalled: true,
  },
  {
    name: 'Segoe UI',
    value: 'Segoe UI, sans-serif',
    category: 'Standard Office',
    isPreinstalled: true,
  },
  {
    name: 'Arial',
    value: 'Arial, sans-serif',
    category: 'Standard Office',
    isPreinstalled: true,
  },
  {
    name: 'Times New Roman',
    value: 'Times New Roman, serif',
    category: 'Standard Office',
    isPreinstalled: true,
  }
];

export const loadLocalFontsFolder = async () => {
  const localTTFFiles = [
    { name: 'Al-Fatemi', file: '/fonts/Al-Fatemi.ttf' },
    { name: 'Al-Kanz', file: '/fonts/Al-Kanz.ttf' },
    { name: 'Amiri-Regular', file: '/fonts/Amiri-Regular.ttf' },
    { name: 'Kanz-al-Lulu', file: '/fonts/Kanz-al-Lulu.ttf' },
    { name: 'Kanz-al-Marjaan', file: '/fonts/Kanz-al-Marjaan.ttf' },
    { name: 'Kanz-al-Yaqoot', file: '/fonts/Kanz-al-Yaqoot.ttf' }
  ];

  for (const item of localTTFFiles) {
    try {
      const fontFace = new FontFace(item.name, `url(${item.file})`);
      const loaded = await fontFace.load();
      document.fonts.add(loaded);
    } catch (e) {
      console.warn('Could not load font file:', item.name, e);
    }
  }
};

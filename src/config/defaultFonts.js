// Pre-installed Default Fonts Configuration for LSD-Microsoft Word Studio
// Put your custom .ttf / .otf / .woff files into public/fonts/ folder and list them below!

export const preinstalledFonts = [
  // Lisan al Dawat & Arabic Pre-installed Fonts
  {
    name: 'Amiri (عربي / لسان الدعوة)',
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
    name: 'Cairo (عصري)',
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
  {
    name: 'Lateef (خفيف)',
    value: 'Lateef, cursive',
    category: 'Arabic Calligraphy',
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
  },
  {
    name: 'Georgia',
    value: 'Georgia, serif',
    category: 'Standard Office',
    isPreinstalled: true,
  }
];

// Helper to register local font files stored in public/fonts/
export const loadLocalFontsFolder = async () => {
  // If user places font files in public/fonts/ font Manifest can register them
  try {
    const res = await fetch('/fonts/manifest.json');
    if (res.ok) {
      const manifest = await res.json();
      for (const font of manifest) {
        const fontFace = new FontFace(font.name, `url(/fonts/${font.file})`);
        const loaded = await fontFace.load();
        document.fonts.add(loaded);
        preinstalledFonts.unshift({
          name: `✨ ${font.name} (Local)`,
          value: `${font.name}, sans-serif`,
          category: 'Custom Local',
          isPreinstalled: true
        });
      }
    }
  } catch (e) {
    // Manifest not present, default preinstalled fonts load seamlessly
  }
};

# Custom Fonts Folder for LSD-Microsoft Word

Drop any `.ttf`, `.otf`, `.woff`, or `.woff2` font files into this `public/fonts/` folder!

To pre-install them into the application font dropdown automatically:
1. Copy your `.ttf` or `.otf` file into `public/fonts/` (e.g. `MyFont.ttf`).
2. Add an entry to `public/fonts/manifest.json`:

```json
[
  {
    "name": "My Custom Font Name",
    "file": "MyFont.ttf"
  }
]
```

The font will automatically be loaded and displayed in the Word Online font family dropdown for all users!

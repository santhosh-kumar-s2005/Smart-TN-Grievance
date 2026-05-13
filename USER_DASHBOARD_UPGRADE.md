# Grievance Platform — User Dashboard Upgrade

## Installation

```
npm install tesseract.js openai
```

## Features
- Submit complaints via text, image (OCR), or audio (speech-to-text)
- Drag & drop image upload
- Audio recording (Web Speech API, browser-based)
- Real-time department and priority detection
- Modern UI: badges, spinner, preview
- All previous features (auth, Firestore, duplicate engine, admin dashboard) remain intact

## Usage

1. **Text Complaint**: Type directly in the description box.
2. **Image Complaint**: Drag & drop or upload an image. Text is extracted automatically.
3. **Audio Complaint**: Click 'Record Audio', speak, then stop. Text is transcribed automatically.
4. **Edit Extracted Text**: You can edit the extracted text before submitting.
5. **Department & Priority**: Auto-detected and shown as badges.
6. **Submit**: Works with any combination of text, image, or audio.

## Notes
- Audio transcription uses browser's Web Speech API (no backend required).
- Image OCR uses Tesseract.js (runs in browser).
- All logic is in `app/user/page.tsx`.
- No changes to admin dashboard or duplicate engine.

## Troubleshooting
- For best audio transcription, use Chrome or Edge.
- If you see 'Speech recognition not supported', try a different browser.
- For OCR, use clear images with readable text.

---

**You’re ready to go!**

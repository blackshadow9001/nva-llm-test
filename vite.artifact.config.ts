import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Builds a page for a claude.ai Artifact: chat and mic use claude.ai's
// built-in features instead of the Worker and the browser recogniser.
// scripts/inline-artifact.mjs then folds it into one file.
// ARTIFACT=desktop builds the desktop prototype; otherwise the companion page.
const entry = process.env.ARTIFACT === 'desktop' ? 'desktop-artifact.html' : 'artifact.html'
const chat = path.resolve(import.meta.dirname, './src/artifact/useArtifactChat.ts')
const speech = path.resolve(import.meta.dirname, './src/artifact/useArtifactSpeech.ts')

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [
      { find: /^(\.\/|@\/companion\/)useCompanionChat$/, replacement: chat },
      { find: /^(\.\/|@\/companion\/)useSpeechInput$/, replacement: speech },
      { find: '@', replacement: path.resolve(import.meta.dirname, './src') },
    ],
  },
  build: {
    outDir: 'dist-artifact',
    emptyOutDir: false,
    cssCodeSplit: false,
    modulePreload: false,
    assetsInlineLimit: 100_000_000,
    rollupOptions: { input: path.resolve(import.meta.dirname, entry) },
  },
})

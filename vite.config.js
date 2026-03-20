import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { cpSync } from 'fs';

function copyStaticPlugin() {
  return {
    name: 'copy-static',
    closeBundle() {
      cpSync('Assets', 'dist/Assets', { recursive: true });
    },
  };
}

export default defineConfig({
  plugins: [react(), copyStaticPlugin()],
  base: '/ChubChampions/',
});

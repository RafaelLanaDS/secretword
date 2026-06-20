import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/secretword/'  // ← confirma que está EXATAMENTE assim
})
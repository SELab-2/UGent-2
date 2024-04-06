import {defineConfig} from 'vitest/config'
import react from '@vitejs/plugin-react'
import fs from 'fs'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        https: {
            key: fs.readFileSync('./.cert/key.pem'),
            cert: fs.readFileSync('./.cert/cert.pem')
        },
        port: 8080, // nodig voor CAS
    },
    test: {
        setupFiles: ['src/test/vitest.setup.ts'],
        environment: 'jsdom',
        coverage: {
            reporter: ['text', 'html'],
        }
    }
})


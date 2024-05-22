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
        setupFiles: ['src/vitest.setup.ts'],
        environment: 'jsdom',
        coverage: {
            reporter: ['text', 'html'],
        },
        exclude: [
            '**/node_modules/**',
            '**/dist/**',
            '**/.{idea,git,cache,output,temp}/**',
            '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',
            '**/*.spec.ts', // Exclude all .spec.ts files
        ],
    },
    build: {
        target: "es2022"
    }
})

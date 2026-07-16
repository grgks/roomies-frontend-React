import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        VitePWA({
            strategies: 'injectManifest',
            srcDir: 'src',
            filename: 'sw.ts',
            registerType: 'autoUpdate',
            injectRegister: 'script',
            manifest: {
                name: 'The Roommies',
                short_name: 'Roommies',
                description: 'Διαχείριση συγκατοίκησης: έξοδα, εργασίες, μηνύματα & προσκλήσεις σπιτιού. Όλα σε ένα μέρος.',
                start_url: '/',
                scope: '/',
                display: 'standalone',
                background_color: '#563773',
                theme_color: '#563773',
                lang: 'el',
                dir: 'ltr',
                categories: ['lifestyle', 'productivity', 'social'],
                icons: [
                    { src: '/roomies-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
                    { src: '/roomies-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
                    { src: '/roomies-maskable-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
                    { src: '/roomies-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
                ],
            },
            injectManifest: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
            },
            devOptions: {
                enabled: false,
            },
        }),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    define: {
        global: 'globalThis',
    },
})
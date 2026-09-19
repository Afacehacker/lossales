/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    light: '#60a5fa',
                    DEFAULT: '#3b82f6',
                    dark: '#2563eb',
                },
                secondary: '#ffffff',
                accent: {
                    neon: '#67e8f9',
                    glow: '#00bcd4',
                },
                dark: {
                    bg: '#0f172a',
                    card: '#1e293b',
                }
            },
            animation: {
                'glow-pulse': 'glow-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float': 'float 3s ease-in-out infinite',
            },
            keyframes: {
                'glow-pulse': {
                    '0%, 100%': { opacity: 1, boxShadow: '0 0 20px rgba(34, 211, 238, 0.5)' },
                    '50%': { opacity: 0.8, boxShadow: '0 0 40px rgba(34, 211, 238, 0.8)' },
                },
                'float': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                }
            },
        },
    },
    plugins: [],
}

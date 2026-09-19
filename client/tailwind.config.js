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
                    light: '#f472b6', // pink-400
                    DEFAULT: '#db2777', // pink-600
                    dark: '#be185d', // pink-700
                    deep: '#831843', // pink-900
                },
                secondary: '#ffffff',
                accent: {
                    neon: '#ec4899',
                    glow: '#f472b6',
                    rose: '#e11d48',
                },
                dark: {
                    bg: '#4c0519',
                    card: '#831843',
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

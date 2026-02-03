/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Direct mappings for "bg-gold", "text-coffee", etc.
                gold: '#C5A059',
                'gold-light': '#D4AF37',
                coffee: {
                    DEFAULT: '#1A1A1A',
                    light: '#333333',
                    dark: '#0F0F0F',
                },
                cream: {
                    DEFAULT: '#F9F7F5',
                    light: '#FDFBF9',
                },
                // Keep existing structure for compatibility if needed
                primary: {
                    DEFAULT: '#1A1A1A',
                    light: '#333333',
                },
                accent: {
                    gold: '#C5A059',
                    hover: '#B08D4B',
                },
                background: {
                    main: '#FFFFFF',
                    secondary: '#F9FAFB',
                },
                border: {
                    light: '#E5E7EB',
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                serif: ['Playfair Display', 'Georgia', 'serif'],
            },
            boxShadow: {
                'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
                'hover': '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
            }
        },
    },
    plugins: [],
}

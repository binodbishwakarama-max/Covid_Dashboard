/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    900: '#0B0F19', // Deepest background
                    800: '#111827', // Card background
                    700: '#1F2937', // Hover/Active
                    400: '#9CA3AF', // Muted text
                    100: '#F3F4F6', // Headings
                },
                status: {
                    active: '#F59E0B',   // Amber-500
                    critical: '#DC2626', // Red-600
                    recovered: '#10B981', // Emerald-500
                    vaccine: '#3B82F6',   // Blue-500
                }
            },
            fontFamily: {
                mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            dropShadow: {
                'glow': '0 0 10px rgba(59, 130, 246, 0.5)',
            },
            backdropBlur: {
                'xs': '2px',
            }
        },
    },
    plugins: [],
}

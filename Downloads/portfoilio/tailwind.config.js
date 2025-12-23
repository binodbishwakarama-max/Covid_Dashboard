/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            backdropBlur: {
                xs: '2px',
            },
        },
    },
    variants: {
        backdropBlur: ['responsive'], // Explicitly enabling variants just to be sure, though default in v3
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
}

const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    theme: {
        screens: {
            sm: '600px',
            md: '768px',
            lg: '992px',
            xl: '1200px',
        },
        colors: {
            transparent: 'transparent',
            primary: {
                1: '#fbfdff',
                2: colors.sky['100'],
                3: colors.sky['200'],
                4: colors.sky['300'],
                5: '#010c13',
            },
            accent: {
                1: colors.amber['500'],
                2: colors.amber['600'],
                3: '#c56b05',
            },
            danger: {
                1: colors.red['400'],
                2: colors.red['600'],
            },
        },
    },
    plugins: [require('@tailwindcss/forms')],
}

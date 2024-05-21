import type { Config } from 'tailwindcss'

export default <Partial<Config>> {
    content: [
        'docs/content/**/*.md'
    ],
    theme: {
        extend: {
            colors: {
                'mariner': {
                    '50': '#eef9ff',
                    '100': '#d8f1ff',
                    '200': '#b9e6ff',
                    '300': '#8ad8ff',
                    '400': '#52c1ff',
                    '500': '#2ba2ff',
                    '600': '#1483fc',
                    '700': '#0c67df',
                    '800': '#1156bc',
                    '900': '#144b94',
                    '950': '#122e59',
                },
                codgray: {
                    '50': '#f8f7f8',
                    '100': '#f0eef0',
                    '200': '#ded9de',
                    '300': '#c2b7c2',
                    '400': '#9f90a0',
                    '500': '#837285',
                    '600': '#6c5c6d',
                    '700': '#584b59',
                    '800': '#4a414b',
                    '900': '#413941',
                    '950': '#080708',
                },
                'martinique': {
                    '50': '#f4f5fa',
                    '100': '#e7e9f2',
                    '200': '#d5d8e8',
                    '300': '#b7bed9',
                    '400': '#959ec5',
                    '500': '#7b82b6',
                    '600': '#696ca7',
                    '700': '#5d5d98',
                    '800': '#52507d',
                    '900': '#393956',
                    '950': '#2d2c3f',
                },

            },
        },
    },
    variants: {
        extend: {
            display: ["group-hover"],
        },
    },
    darkMode: 'class',
}
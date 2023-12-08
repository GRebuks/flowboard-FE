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
        },
    },
  },
  darkMode: 'class',
}
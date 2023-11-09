import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      fontFamily: {
        default: ['var(--font-mono)'],
        kr: ['var(--font-mono-kr)'],
      },
      textColor: {
        'half': '#dcdfe4',
        'half-red': '#e06c75',
        'half-green': '#98c379',
        'half-yellow': '#e5c07b',
        'half-blue': '#61afef',
        'half-purple': '#c678dd',
        'half-cyan': '#56b6c2',
        'half-white': '#dcdfe4',
        'half-black': '#282c34',
      },
      color: {
        'half-dark': '#dcdfe4',
        'half-dark-red': '#e06c75',
        'half-dark-green': '#98c379',
        'half-dark-yellow': '#e5c07b',
        'half-dark-blue': '#61afef',
        'half-dark-purple': '#c678dd',
        'half-dark-cyan': '#56b6c2',
        'half-dark-white': '#dcdfe4',
        'half-dark-black': '#282c34',
      },
      backgroundColor: {
        'half-key': '#4D5BD6',
        'half-dark': '#282c34',
        'half-dark-red': '#e06c75',
        'half-dark-green': '#98c379',
        'half-dark-yellow': '#e5c07b',
        'half-dark-blue': '#61afef',
        'half-dark-purple': '#c678dd',
        'half-dark-cyan': '#56b6c2',
        'half-dark-white': '#dcdfe4',
        'half-dark-black': '#282c34',
        'half-light-red': '#e45649',
        'half-light-green': '#50a14f',
        'half-light-yellow': '#c18401',
        'half-light-blue': '#0184bc',
        'half-light-purple': '#a626a4',
        'half-light-cyan': '#0997b3',
        'half-light-white': '#fafafa',
        'half-light-black': '#383a42',
      },
      borderColor: {
        'half-dark': '#dcdfe4',
        'half-dark-red': '#e06c75',
        'half-dark-green': '#98c379',
        'half-dark-yellow': '#e5c07b',
        'half-dark-blue': '#61afef',
        'half-dark-purple': '#c678dd',
        'half-dark-cyan': '#56b6c2',
        'half-dark-white': '#dcdfe4',
        'half-dark-black': '#282c34',
        'half-light-red': '#e45649',
        'half-light-blue': '#0184bc',
      },
    },
  },
  plugins: [],
}
export default config

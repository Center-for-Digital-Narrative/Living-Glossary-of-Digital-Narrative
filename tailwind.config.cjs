const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
        container: {
            center: true,
        },
		extend: {
			fontFamily: {
				'sans': ['"Segoe UI"', ...defaultTheme.fontFamily.sans],
			},
			typography: {
				DEFAULT: {
					css: {
						'--tw-prose-body': '#002934',
						'--tw-prose-headings': '#002934',
						'--tw-prose-bold': '#002934',
                        '--tw-prose-invert-body': '#dbdee1',
                        '--tw-prose-invert-headings': '#317284',
						maxWidth: "100ch"
					}
				}
			}
		}

	},
	darkMode: 'class',
	plugins: [
		require('@tailwindcss/typography'),
	],
};

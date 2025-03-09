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
						'--tw-prose-headings': '#000000',
						'--tw-prose-bold': '#002934',
                        '--tw-prose-invert-body': '#dbdee1',
                        '--tw-prose-invert-headings': '#FFFFFF',
						maxWidth: "100ch",
						h2: {
							'text-underline-offset': '8px',
							'text-decoration-color': '#2B9991',
							'text-decoration-line': 'underline',
						},
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

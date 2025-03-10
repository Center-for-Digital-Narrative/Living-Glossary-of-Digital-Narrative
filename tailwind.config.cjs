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
            colors: {
                'dark-blue': '#002934',
                'beige': '#f5f5f5',
                'accent-blue': '#2B9991'
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
                        a: {
                            fontWeight: 'normal',
                            color: 'var(--tw-prose-body)',
                            "&:visited": {
                                color: '#551a8b',
                            },
                            ".dark": {
                                color: "var(--tw-prose-invert-body)",
                            },
                            ".dark &:visited": {
                                color: '#b086d5',
                            },
                            "&:hover": {
                                textDecoration: "none",
                            }
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

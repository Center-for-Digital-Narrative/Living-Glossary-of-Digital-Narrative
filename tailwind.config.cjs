module.exports = {
	theme: {
		extend: {
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
                            wordBreak: 'break-word',
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
	}
};

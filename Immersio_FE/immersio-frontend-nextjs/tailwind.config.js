/* eslint-disable no-undef */
module.exports = {
	prefix: 'tw-',
	content: ['./src/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
	mode: 'jit',
	theme: {
		extend: {
			colors: {
				gray: '#637381',
				lightGray: '#e8eef2',
				borderGray: '#c9c9c9',
				blue: '#3c85ee',
				deactivateStatus: '#DDDDDD',
				deleteIconDavid: '#E77470',
				yellowDavid: '#ff9730',
			},
			screens: {
				xxl: '1560px',
			},
		},
		plugins: [require('tailwindcss'), require('precss'), require('autoprefixer')],
	},
	corePlugins: {
		preflight: false, // <== disable this!
	},
};

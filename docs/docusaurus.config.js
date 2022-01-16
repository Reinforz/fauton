// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/vsDark');

/** @type {import('@docusaurus/types').Config} */
const config = {
	title: 'Fauton',
	tagline: 'An ecosystem of packages to work with cfg/dfa/nfa/pda',
	url: 'https://docs.fauton.xyz',
	baseUrl: '/',
	onBrokenLinks: 'log',
	onBrokenMarkdownLinks: 'warn',
	favicon: 'img/favicon.ico',
	organizationName: 'devorein',
	projectName: 'fauton',
	presets: [
		[
			'classic',
			/** @type {import('@docusaurus/preset-classic').Options} */
			({
				docs: {
					sidebarPath: require.resolve('./sidebars.js'),
					// Please change this to your repo.
					editUrl: 'https://github.com/devorein/fauton/tree/main/docs/',
				},
				theme: {
					customCss: require.resolve('./src/css/custom.css'),
				},
			}),
		],
	],
	plugins: [
		[
			'docusaurus-plugin-typedoc',
			{
				// TypeDoc options
				entryPoints: ['../packages/cfg/libs/index.ts'],
				tsconfig: '../packages/cfg/tsconfig.json',

				// Plugin options
				out: 'fauton-cfg',
				sidebar: {
					categoryLabel: '@fauton/cfg',
					position: 0,
					fullNames: true,
				},
			},
		],
	],
	themeConfig:
		/** @type {import('@docusaurus/preset-classic').ThemeConfig} */
		({
			colorMode: {
				switchConfig: {
					darkIcon: '/img/moon.svg',
					lightIcon: '/img/sun.svg',
				},
			},
			hideableSidebar: true,
			navbar: {
				title: 'Fauton',
				logo: {
					alt: 'Fauton Logo',
					src: 'img/logo.svg',
				},
				items: [
					{
						type: 'doc',
						docId: 'intro',
						position: 'left',
						label: 'Docs',
					},
					{
						href: 'https://github.com/devorein/fauton',
						label: 'GitHub',
						position: 'right',
					},
				],
			},
			footer: {
				style: 'dark',
				links: [
					{
						title: 'Docs',
						items: [
							{
								label: 'Tutorial',
								to: '/docs/intro',
							},
						],
					},
				],
				copyright: `Copyright © ${new Date().getFullYear()}. Made by <a href="https://github.com/devorein" target="_blank">devorein</a>, hosted on vercel.`,
			},
			prism: {
				theme: lightCodeTheme,
				darkTheme: darkCodeTheme,
			},
		}),
};

module.exports = config;

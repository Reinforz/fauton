// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/vsDark');
const path = require('path');

/** @type {import('@docusaurus/types').Config} */
const config = {
	title: 'Fauton',
	tagline: 'An ecosystem of packages to work with automaton(cfg/dfa/nfa/pda/e-nfa)',
	url: 'https://docs.fauton.xyz',
	baseUrl: '/',
	onBrokenLinks: 'log',
	onBrokenMarkdownLinks: 'warn',
	favicon: 'img/favicon.svg',
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
				id: 'docusaurus-plugin-typedoc-1',
				// TypeDoc options
				entryPoints: ['../packages/cfg/libs/index.ts'],
				tsconfig: '../packages/cfg/tsconfig.json',

				// Plugin options
				out: 'cfg',
				sidebar: {
					categoryLabel: '@fauton/cfg',
					position: 0,
					fullNames: true,
				},
			},
		],
		[
			'docusaurus-plugin-typedoc',
			{
				id: 'docusaurus-plugin-typedoc-2',
				// TypeDoc options
				entryPoints: ['../packages/fa/libs/index.ts'],
				tsconfig: '../packages/fa/tsconfig.json',

				// Plugin options
				out: 'fa',
				sidebar: {
					categoryLabel: '@fauton/fa',
					position: 0,
					fullNames: true,
				},
			},
		],
		[
			'docusaurus-plugin-example-generator',
			{
				packageDirectory: path.resolve(__dirname, '../packages'),
				moduleMarkdownDirectory: path.resolve(__dirname, './docs'),
				packages: ['cfg', 'fa'],
				id: 'example-generator',
				scope: 'fauton',
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
					src: 'img/favicon.svg',
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
								label: 'Intro',
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

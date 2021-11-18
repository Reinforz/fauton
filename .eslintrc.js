module.exports = {
	env: {
		es2021: true,
		node: true,
	},
	extends: ['airbnb-base', 'prettier', 'plugin:import/recommended', 'plugin:import/typescript'],
	parser: '@typescript-eslint/parser',
	ignorePatterns: ['dist', 'tests', 'examples', 'experiment'],
	parserOptions: {
		project: './tsconfig.json',
		ecmaVersion: 12,
		sourceType: 'module',
	},
	plugins: ['@typescript-eslint', 'prettier', 'import'],
	rules: {
		'import/extensions': [
			'error',
			'ignorePackages',
			{
				js: 'never',
				jsx: 'never',
				ts: 'never',
				tsx: 'never',
			},
		],
		'no-await-in-loop': 'off',
		'import/prefer-default-export': 'off',
		'no-else-return': 'off',
		'one-var': 'off',
	},
};

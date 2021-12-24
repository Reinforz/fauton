module.exports = {
	// Configuration for JavaScript files
	extends: ['airbnb-base', 'plugin:prettier/recommended'],
	rules: {
		'prettier/prettier': 'off',
	},
	overrides: [
		// Configuration for TypeScript files
		{
			files: ['**/*.ts', '**/*.tsx'],
			plugins: ['@typescript-eslint', 'unused-imports'],
			extends: ['airbnb-typescript', 'next', 'next/core-web-vitals', 'plugin:prettier/recommended'],
			parserOptions: {
				project: './tsconfig.json',
				tsconfigRootDir: __dirname,
			},
			rules: {
				'one-var': 'off',
				'prefer-destructuring': 'off',
				'react/jsx-props-no-spreading': 'off',
				'no-underscore-dangle': 'off',
				'prettier/prettier': 'off',
				'react/destructuring-assignment': 'off', // Vscode doesn't support automatic destructuring, it's a pain to add a new variable
				'jsx-a11y/anchor-is-valid': 'off', // Next.js use his own internal link system
				'react/require-default-props': 'off', // Allow non-defined react props as undefined
				'@next/next/no-img-element': 'off', // We currently not using next/image because it isn't supported with SSG mode
				'import/prefer-default-export': 'off',
				'@typescript-eslint/no-unused-vars': 'off',
				'jsx-a11y/click-events-have-key-events': 'off',
				'unused-imports/no-unused-imports': 'error',
				'unused-imports/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
				'no-param-reassign': ['error', { props: false }],
				'no-else-return': ['error', { allowElseIf: true }],
			},
		},
	],
};

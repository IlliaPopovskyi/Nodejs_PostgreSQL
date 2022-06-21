module.exports = {
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: 'tsconfig.json',
		sourceType: 'module',
	},
	plugins: ['import', 'prettier', '@typescript-eslint'],
	extends: [
		'eslint:recommended',
		'plugin:node/recommended',
		'airbnb-base',
		'plugin:import/recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:prettier/recommended',
	],
	root: true,
	env: {
		node: true,
	},
	settings: {
		'import/resolver': {
			node: {
				extensions: ['.js', '.jsx', '.ts', '.tsx'],
			},
		},
	},
	ignorePatterns: ['.eslintrc.js'],
	rules: {
		'no-underscore-dangle': 'off',
		'import/extensions': 'off',
		'node/no-missing-import': 'off',
		'import/prefer-default-export': 0,
		'node/no-missing-require': 'off',
		'node/no-unsupported-features/es-syntax': 'off',
		'no-unused-expressions': ['error', { allowTernary: true }],
		'no-ternary': 'off',
		'no-console': 'off',
		'no-return-await': 'off',
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/no-explicit-any': 1,
		'@typescript-eslint/no-var-requires': 0,
		'no-shadow': 0,
	},
};

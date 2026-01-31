export default [
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    ignores: ['node_modules/', '.next/'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module'
    },
    rules: {
      'no-unused-vars': 'warn'
    }
  }
];

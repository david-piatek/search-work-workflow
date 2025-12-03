module.exports = {
  extends: ['eslint:recommended', 'plugin:svelte/recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  rules: {
    'svelte/no-at-html-tags': 'warn',
  },
};

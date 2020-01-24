module.exports = {
  extends: ['airbnb'],
  plugins: ['@typescript-eslint'],
  rules: {
    'import/prefer-default-export': 0,
    'jsx-a11y/anchor-has-content': 0,
    'jsx-a11y/anchor-is-valid': 0,
    'no-console': 0,
    'arrow-parens': ['error', 'as-needed'],
    'class-methods-use-this': 0,
    'max-len': ['error', 120],
    'consistent-return': 0,
    'no-confusing-arrow': 0,
    'no-mixed-operators': 0,
    'comma-dangle': [2, 'always-multiline'],
    quotes: [2, 'single'],
  },
};

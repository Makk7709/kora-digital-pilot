/** @type {import('@commitlint/types').UserConfig} */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Allow longer headers because some scopes are descriptive.
    'header-max-length': [2, 'always', 120],
  },
};

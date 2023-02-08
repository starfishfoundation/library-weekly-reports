module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'init',
        'build',
        'ci',
        'chore',
        'dev',
        'docs',
        'feat',
        'fix',
        'lint',
        'perf',
        'refactor',
        'revert',
        'test',
        'ui',
      ],
    ],
  },
}

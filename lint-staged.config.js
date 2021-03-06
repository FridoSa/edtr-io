module.exports = {
  linters: {
    '{{.cirleci,docs,packages/*,scripts}/{{__fixtures__,__stories__,__tests__,src}/**/*,*},*}.{js,jsx,ts,tsx,json,md,yaml,yml}': [
      'prettier --write',
      'git add'
    ],
    '{{packages/*,scripts}/{{__fixtures__,__stories__,__tests__,src}/**/*,*},*}.{js,jsx,ts,tsx}': [
      'eslint --fix',
      'prettier --write',
      'jest --findRelatedTests',
      'git add'
    ]
  }
}

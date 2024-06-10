const tsEslintPlugin = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const importPlugin = require('eslint-plugin-import');

module.exports = [
  {
    files: ['**/*.ts'],
    ignores: [
      // OSX
      '.DS_STORE',
      '.DS_Store',
      '._*',

      // Windows
      'Thumbs.db',
      'Desktop.ini',

      // Logs
      '*.log*',

      // package managers
      '.yarn/**/*',

      //!.yarn/cache
      '.pnp.*',
      'node_modules',
      'package-lock.json',

      // Build
      '**/dist/**/*',
      '**/node_modules/**',
      '**/*/.tsbuildinfo',
      '**/*.d.ts',
      '**/*.js',

      // Output of 'npm pack'
      '*.tgz',

      // dotenv environment variables file
      '.env',
    ],
    plugins: {'@typescript-eslint': tsEslintPlugin, import: importPlugin},
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: true,
        ecmaVersion: 2023,
        sourceType: 'module',
      },
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          ecmaVersion: 2023,
          project: ['**/*/tsconfig.json'],
          tsconfigRootDir: '.',
          projectFolderIgnoreList: ['**/node_modules/**'],
        },
        node: true,
      },
    },
    rules: {
      'max-len': ['error', {code: 120}],
      'no-eval': ['error', {allowIndirect: true}],
      'no-floating-decimal': 'error',
      'space-infix-ops': 'error',
      'new-cap': ['error', {capIsNewExceptionPattern: 'Mixin$'}],
      'brace-style': ['error', 'stroustrup', {allowSingleLine: true}],
      indent: 'off',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          fixStyle: 'separate-type-imports',
          prefer: 'type-imports',
        },
      ],
      '@typescript-eslint/indent': [
        'error',
        2,
        {
          SwitchCase: 1,
          VariableDeclarator: 1,
          outerIIFEBody: 1,
          MemberExpression: 1,
          FunctionDeclaration: {parameters: 1, body: 1},
          FunctionExpression: {parameters: 1, body: 1},
          CallExpression: {arguments: 1},
          ArrayExpression: 1,
          ObjectExpression: 1,
          ImportDeclaration: 1,
          flatTernaryExpressions: false,
          ignoreComments: false,
          ignoredNodes: [
            'TemplateLiteral *',
            'TSTypeParameterInstantiation',
            'FunctionExpression >.params[decorators.length > 0]',
            'FunctionExpression >.params > :matches(Decorator, :not(:first-child))',
            'ClassBody.body > PropertyDefinition[decorators.length > 0] >.key',
          ],
        },
      ],
      'operator-linebreak': ['error', 'after', {overrides: {'?': 'before', ':': 'before'}}],
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index'], 'object', 'unknown', 'type'],
          'newlines-between': 'always',
          warnOnUnassignedImports: true,
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      '@typescript-eslint/prefer-string-starts-ends-with': 'off',
      '@typescript-eslint/no-dynamic-delete': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/member-ordering': [
        'error',
        {
          default: [
            'signature',
            'constructor',
            'static-field',
            'public-field',
            'protected-field',
            'private-field',
            'field',
            'public-method',
            'static-method',
            'protected-method',
            'private-method',
            'method',
          ],
        },
      ],
      'no-throw-literal': 'off',
      'class-methods-use-this': [
        'error',
        {
          exceptMethods: [
            'connectedCallback',
            'disconnectedCallback',
            'performUpdate',
            'shouldUpdate',
            'firstUpdated',
            'update',
            'updated',
            'createRenderRoot',
            'render',
          ],
        },
      ],
    },
  },
];

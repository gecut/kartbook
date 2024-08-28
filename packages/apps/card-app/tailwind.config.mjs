import {tailwindConfig} from '@gecut/styles/index.js';
import path from 'path';

/** @type {import('tailwindcss').Config} */
export default {
  ...tailwindConfig,

  content: [
    'index.html',
    '**/*.ts',
    './node_modules/.vite/deps/**/*.js',
    path.dirname(require.resolve('@gecut/components')) + '/**/*.ts',
  ],
};

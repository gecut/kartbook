import {tailwindConfig} from '@gecut/styles/index.js';
import path from 'path';

/** @type {import('tailwindcss').Config} */
export default {
  ...tailwindConfig,

  content: ['index.html', 'src/**/*.ts', path.dirname(require.resolve('@gecut/components')) + '/**/*.js'],
};

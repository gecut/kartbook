import {tailwindConfig} from '@gecut/styles';
import forms from '@tailwindcss/forms';
import path from 'path';

const systemFont = [
  'system-ui',
  '-apple-system',
  'BlinkMacSystemFont',
  '"Segoe UI"',
  '"Roboto"',
  '"Oxygen"',
  '"Ubuntu"',
  '"Cantarell"',
  '"Open Sans"',
  'Helvetica Neue',
  '"Arial"',
  '"Noto Sans"',
  '"Apple Color Emoji"',
  '"Segoe UI Emoji"',
  '"Segoe UI Symbol"',
  '"Noto Color Emoji"',
];

/** @type {import('tailwindcss').Config} */
export default {
  ...tailwindConfig,

  content: ['index.html', 'src/**/*.ts', path.dirname(require.resolve('@gecut/components')) + '/**/*.js'],

  theme: {
    ...tailwindConfig.theme,

    fontFamily: {
      'varela-round': [
        ['Varela Round', 'sans-serif', ...systemFont],
        {
          fontFeatureSettings: '"calt" 1, "tnum" 0',
        },
      ],
      roboto: [
        ['Roboto', 'sans-serif', ...systemFont],
        {
          fontFeatureSettings: '"calt" 1, "tnum" 0',
        },
      ],
      system: systemFont,
      sans: systemFont,
    },
  },

  plugins: [forms, ...tailwindConfig.plugins],
};

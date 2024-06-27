import {gecutCenterTopBar} from '@gecut/components';

import logo from '../../../public/logo.svg?raw';
import {titleContext} from '../contexts/title.js';

import SolarBellBingBoldDuotone from '~icons/solar/bell-bing-bold-duotone';

export function topBar() {
  return gecutCenterTopBar({
    title: titleContext,

    startIcon: {
      type: 'normal',
      svg: logo,
    },
    endIconList: [
      {
        element: 'icon-button',
        type: 'normal',
        svg: SolarBellBingBoldDuotone,
      },
    ],
  });
}

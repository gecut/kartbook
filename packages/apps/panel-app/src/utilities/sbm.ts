import {SnackBarManager} from '@gecut/components';

export const sbm = new SnackBarManager({
  style: {
    position: 'fixed',
    right: 0,
    left: 0,
    maxWidth: '480px',
    margin: '0 auto',
    bottom: '5rem',
    zIndex: '500',
    padding: '2px 16px',
  },
});

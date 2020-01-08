import Types from '../types';
import types from '../types';

export const onThemeChange = theme => {
  return {type: types.THEME_CHANGE, theme};
};

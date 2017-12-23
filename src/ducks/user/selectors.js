// @flow

import type { State } from '../../config/types';

export const isUserLogged = (state: State): boolean => !!state.user;

export default null;

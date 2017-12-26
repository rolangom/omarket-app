// @flow

import type { State } from '../../common/types';

export const isUserLogged = (state: State): boolean => !!state.user;

export default null;

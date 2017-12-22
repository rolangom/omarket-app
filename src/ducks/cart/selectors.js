// @flow

import type { State } from '../../config/types';

export const getCartItems = (state: State) =>
  state
    .cartItems
    .allIds
    .map((id: string) => state.cartItems.byId[id]);

export default null;

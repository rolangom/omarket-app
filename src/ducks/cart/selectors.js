// @flow

import type { CartItem, State } from '../../config/types';

export const getCartItems = (state: State): CartItem =>
  state
    .cartItems
    .allIds
    .map((id: string) => state.cartItems.byId[id]);

export const getCartItemsSubTotalPrice = (state: State): number =>
  getCartItems(state)
    .reduce((acc: number, it: CartItem) =>
      (it.qty * state.products.byId[it.productID].price) + acc, 0);

export const getCartItemsQty = (state: State): number =>
  getCartItems(state)
    .reduce((acc: number, it: CartItem) => it.qty + acc, 0);

export default null;

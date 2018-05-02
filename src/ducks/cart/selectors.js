// @flow

import type { CartItem, State } from '../../common/types';
import { defaultEmptyArr } from '../../common/utils/constants';
import { isOfferDiscount, getOfferPrice } from '../../common/utils';

export const getCartItems = (state: State): CartItem =>
  state
    .cartItems
    .allIds
    .map((id: string) => state.cartItems.byId[id]);
const getOfferPriceOr = (productID: string, state: State) => {
  const product = state.products.byId[productID];
  const [offerId] = state.offers.rel[productID] || defaultEmptyArr;
  const offer = state.offers.byId[offerId];
  return offer && isOfferDiscount(offer)
    ? getOfferPrice(product.price, offer)
    : product.price;
};

export const getCartItemsSubTotalPrice = (state: State): number =>
  getCartItems(state).reduce(
    (acc: number, it: CartItem) =>
      (it.qty * getOfferPriceOr(it.productID, state)) + acc,
    0,
  );

export const getCartItemsQty = (state: State): number =>
  getCartItems(state)
    .reduce((acc: number, it: CartItem) => it.qty + acc, 0);

export default null;

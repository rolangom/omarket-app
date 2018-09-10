// @flow

import type { CartItem, State, Product } from '../../common/types';
import { defaultEmptyArr } from '../../common/utils/constants';
import { isOfferDiscount, getOfferPrice, getSecureTaxB1 } from '../../common/utils';

export const getCartItems = (state: State): CartItem =>
  Object.values(state.cartItems.byId);

const getOfferPriceOr = (useTax: boolean, productID: string, state: State): number => {
  const product: Product = state.products.byId[productID];
  const [offerId] = state.offers.rel[productID] || defaultEmptyArr;
  const offer = state.offers.byId[offerId];
  const taxFactor =
    (useTax)
      ? getSecureTaxB1(product.taxFactor)
      : 1;
  return offer && isOfferDiscount(offer)
    ? getOfferPrice(product.price, offer) * taxFactor
    : product.price * taxFactor;
};

export const getCartItemsSubTotalPrice = (state: State): number =>
  getCartItems(state).reduce(
    (acc: number, it: CartItem) =>
      (it.qty * getOfferPriceOr(false, it.productID, state)) + acc,
    0,
  );

export const getCartTaxTotal = (state: State): number =>
  getCartItems(state).reduce(
    (acc: number, it: CartItem) =>
      (it.qty * getOfferPriceOr(true, it.productID, state)) + acc,
    0,
  );

export const getCartItemsQty = (state: State): number =>
  getCartItems(state).reduce((acc: number, it: CartItem) => it.qty + acc, 0);

export default null;

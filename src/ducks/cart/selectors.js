// @flow

import type { CartItem, State, Product } from '../../common/types';
import { defaultEmptyArr } from '../../common/utils/constants';
import { isOfferDiscount, getOfferPrice } from '../../common/utils';

export const getCartItems = (state: State): CartItem =>
  state
    .cartItems
    .allIds
    .map((id: string) => state.cartItems.byId[id]);
const getOfferPriceOr = (productID: string, state: State) => {
const getProductTax = (product: Product): number =>
  (product.taxFactor === undefined)
    ? 0
    : product.taxFactor > 1
    ? product.taxFactor * 0.01
    : product.taxFactor;

const getOfferPriceOr = (useTax: boolean, productID: string, state: State): number => {
  const product = state.products.byId[productID];
  const [offerId] = state.offers.rel[productID] || defaultEmptyArr;
  const offer = state.offers.byId[offerId];
  const taxFactor =
    (useTax)
      ? getProductTax(product)
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

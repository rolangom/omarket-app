// @flow
import { combineReducers } from 'redux';
import { createAction, createReducer } from 'redux-act';
import { createLogic } from 'redux-logic';
import { NavigationActions } from 'react-navigation';

import type { CartItem, KeysOf, Product } from '../../common/types';
import {
  setImmutable,
  deleteImmutable,
  uniqFilterFn,
  assert,
  multiDispatch,
} from '../../common/utils';
import {
  addError,
  addInfo,
  setIsLoading,
  setShowRelatedProdId,
  setReserveConfirmVisible,
} from '../global';
import { postCurrentCart } from '../savedCarts';
import { setProducts } from '../products';

// export const reqPostCartProduct = createAction(
//   'REQ_POST_CART_PRODUCT',
//   (productID: string, qty: number, offerID) => ({ productID, qty, offerID }),
// );
export const postCartProduct = createAction(
  'POST_CART_PRODUCT',
  (productID: string, qty: number, offerID) => ({ productID, qty, offerID }),
  (p, q, o, noNavigate) => ({ prevent: false, noNavigate }),
);
export const incrCartProduct = createAction(
  'INCR_CART_PRODUCT',
  (productID: string, offerID: ?string) => ({ productID, offerID }),
  () => ({ prevent: false }),
);
export const changeCartProductQty = createAction(
  'CHANGE_CART_PRODUCT_QTY',
  (productID: string, qty: number) => ({ productID, qty }),
  (p, q, prevent) => ({ prevent }),
);
export const changeCartProductDescr = createAction(
  'CHANGE_CART_PRODUCT_DESCR',
  (productID: string, descr: string) => ({ productID, descr }),
);
export const deleteCartProduct = createAction('DELETE_CART_PRODUCT');
export const clearCartItems = createAction('CLEAR_CART_ITEMS');
export const setCartProducts = createAction('SET_CART_PRODS');
export const reserveCartProducts = createAction('RESERVE_CART_PRODUCTS');
export const preAlertNoReserveCartProducts = createAction(
  'PREALERT_RESERVE_CART_PROD',
);

const byId = createReducer(
  {
    [setProducts]: (state: KeysOf<CartItem>, products: Product[]) => {
      const productsKeys = products.map(it => it.id);
      return Object.entries(state).reduce(
        (acc: KeysOf<CartItem>, [key, value]: [string, CartItem]) =>
          productsKeys.includes(key)
            ? Object.assign(acc, { [key]: value }) : acc,
        {}
      );
    },
    [setCartProducts]: (state: KeysOf<CartItem>, cart: KeysOf<CartItem>) =>
      cart,
    [postCartProduct]: (state: KeysOf<CartItem>, item: CartItem) => ({
      ...state,
      [item.productID]: item,
    }),
    [changeCartProductQty]: (
      state: KeysOf<CartItem>,
      { productID, qty }: CartItem,
    ) => setImmutable(state, `${productID}.qty`, state[productID].qty + qty),
    [incrCartProduct]: (state: KeysOf<CartItem>, item: CartItem) => ({
      ...state,
      [item.productID]: {
        ...item,
        qty: ((state[item.productID] && state[item.productID].qty) || 0) + 1,
      },
    }),
    [changeCartProductDescr]: (
      state: KeysOf<CartItem>,
      { productID, descr }: CartItem,
    ) => setImmutable(state, `${productID}.descr`, descr),
    [deleteCartProduct]: (state: KeysOf<CartItem>, productID: string) =>
      deleteImmutable(state, productID),
    [clearCartItems]: () => ({}),
  },
  {},
);

const allIds = createReducer(
  {
    [setProducts]: (state: string[], products: Product[]) => {
      const productsKeys = products.map(it => it.id);
      return Object.entries(state).reduce(
        (acc: string[], key: string) =>
          productsKeys.includes(key)
            ? (acc.push(key), acc) : acc,
        []
      );
    },
    [setCartProducts]: (state: string[], cart: KeysOf<CartItem>) =>
      Object.keys(cart),
    [postCartProduct]: (state: string[], item: CartItem) =>
      state.concat(item.productID).filter(uniqFilterFn),
    [incrCartProduct]: (state: string[], item: CartItem) =>
      state.concat(item.productID).filter(uniqFilterFn),
    // [changeCartProductQty]: (state: string[]) => state,
    [deleteCartProduct]: (state: string[], productID: string) =>
      state.filter((id: string) => id !== productID),
    [clearCartItems]: () => [],
  },
  [],
);

const reducer = combineReducers({
  byId,
  allIds,
});

const doesRelatedProductExists = (products: KeysOf<Product>, product: Product): boolean => {
  const [relatedId] = Object.keys(product.relatedProds);
  return !!products[relatedId];
};

export const postCardProductLogic = createLogic({
  type: postCartProduct.getType(),
  validate({ action, getState }, allow, reject) {
    // allow(action);
    (action.payload &&
      action.payload.qty &&
      action.payload.qty > 0
      ? allow
      : reject)({
      ...action,
      payload: {
        ...action.payload,
        offer: getState().offers.byId[action.payload.offerID] || null,
      },
    });
  },
  process({ action, getState }, dispatch, done) {
    console.log('postCardProductLogic process');
    const { noNavigate } = action.meta;
    const { productID } = action.payload;
    const { products: { byId: products } } = getState();
    const product: Product = products[productID];
    if (!noNavigate)
      dispatch(NavigationActions.navigate({ routeName: 'Cart' }));
    if (
      // noNavigate &&
      Object.keys(product.relatedProds).length > 0 &&
      doesRelatedProductExists(products, product)
    ) dispatch(setShowRelatedProdId(productID));
    done();
  },
});

const deleteCartItemsIfEmpty = (getState, dispatch) => {
  const cartItems: CartItem[] = Object.values(getState().cartItems.byId);
  cartItems
    .filter(it => it.qty <= 0)
    .forEach(it => dispatch(deleteCartProduct(it.productID)));
};

export const requestReserveCartProdLogic = createLogic({
  type: reserveCartProducts.getType(),
  debounce: 2500,
  process: async ({ getState, firebase, action }, dispatch, done) => {
    try {
      // dispatch(setIsLoading(true));
      const { cartItems: { byId: cart }, user } = getState();
      deleteCartItemsIfEmpty(getState, dispatch);
      if (!(user && user.uid)) return;
      const token = await firebase.auth().currentUser.getIdToken();
      const resp = await fetch(
        'https://us-central1-shop-f518d.cloudfunctions.net/reserveProducts',
        // 'http://localhost:5000/shop-f518d/us-central1/reserveProducts',
        {
          method: 'POST',
          body: JSON.stringify(cart),
          headers: {
            'id-token': token,
            'content-type': 'application/json',
          },
        },
      );
      const jsonResp = await resp.json();
      assert(resp.ok, jsonResp.message);
      console.log('calcReserveCartLogic resp', jsonResp);
      const { errors = [] } = jsonResp;
      const getProd = productID =>
        getState().products.byId[productID] || {
          id: productID,
          name: '[???]',
          qty: 0,
        };
      const getProdName = prod => prod.name;
      errors.map(productID =>
        dispatch(
          addInfo(`No quedan ${getProdName(getProd(productID))} suficientes.`),
        ),
      );
      multiDispatch(
        dispatch,
        ...errors.map(productId => {
          const prod = getProd(productId);
          return changeCartProductQty(productId, prod.qty, true);
        }),
      );
      deleteCartItemsIfEmpty(getState, dispatch);
      const { noPreAlert = false } = action.payload || {};
      !noPreAlert && dispatch(preAlertNoReserveCartProducts());
    } catch (err) {
      console.warn('requestReserveCartProdLogic', err.message);
      dispatch(addError(err.message));
    } finally {
      // dispatch(setIsLoading(false));
      done();
    }
  },
});

export const reserveCartLogic = createLogic({
  type: [
    postCartProduct.getType(),
    changeCartProductQty.getType(),
    incrCartProduct.getType(),
  ],
  validate({ action }, next, reject) {
    console.log('reserveCartLogic', action);
    const { prevent = false } = action.meta;
    prevent ? reject(action) : next(action);
  },
  process({ action }, dispatch, done) {
    console.log('reserveCartLogic reserveCartLogic');
    dispatch(reserveCartProducts(action.payload));
    done();
  },
});

export const preAlertNoReserveCartLogic = createLogic({
  type: preAlertNoReserveCartProducts.getType(),
  debounce: 5 * 60 * 1000, // 5 mins
  latest: true,
  process({ getState }, dispatch, done) {
    try {
      console.log('preAlertNoReserveCartProducts start');
      const onNeutral = (_getState, _dispatch, _done) => {
        const { reserveModalVisible } = _getState().global;
        reserveModalVisible && _dispatch(postCurrentCart());
        _done();
      };
      dispatch(setReserveConfirmVisible(true));
      setTimeout(onNeutral, 10000, getState, dispatch, done);
    } catch (err) {
      console.warn('preAlertNoReserveCartLogic', err);
      dispatch(addError(err.message));
      done();
    }
  },
});

export const setCartProductsLogic = createLogic({
  type: setCartProducts.getType(),
  validate({ action }, allow, reject) {
    action.payload ? allow(action) : reject();
  },
});

export default reducer;

// @flow
import { combineReducers } from 'redux';
import { createAction, createReducer } from 'redux-act';
import { createLogic } from 'redux-logic';
import { NavigationActions } from 'react-navigation';

import type { CartItem, KeysOf } from '../../common/types';
import {
  setImmutable,
  deleteImmutable,
  uniqFilterFn,
  assert, multiDispatch,
} from '../../common/utils';
import {
  addError,
  addInfo,
  setIsLoading,
  setReserveConfirmVisible,
} from '../global';
import { postCurrentCart } from '../savedCarts';

export const reqPostCartProduct = createAction(
  'REQ_POST_CART_PRODUCT',
  (productID: string, qty: number, offerID) => ({ productID, qty, offerID }),
);
export const postCartProduct = createAction(
  'POST_CART_PRODUCT',
  (productID: string, qty: number, offerID) => ({ productID, qty, offerID }),
);
export const changeCartProductQty = createAction(
  'CHANGE_CART_PRODUCT_QTY',
  (productID: string, qty: number) => ({ productID, qty }),
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
    [setCartProducts]: (state: KeysOf<CartItem>, cart: KeysOf<CartItem>) =>
      cart,
    [postCartProduct]: (state: KeysOf<CartItem>, item: CartItem) => ({
      ...state,
      [item.productID]: item,
    }),
    [changeCartProductQty]: (
      state: KeysOf<CartItem>,
      { productID, qty }: CartItem,
    ) => setImmutable(state, `${productID}.qty`, qty),
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
    [setCartProducts]: (state: string[], cart: KeysOf<CartItem>) =>
      Object.keys(cart),
    [postCartProduct]: (state: string[], item: CartItem) =>
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

export const postCardProductLogic = createLogic({
  type: postCartProduct.getType(),
  validate({ action, getState }, allow, reject) {
    (action.payload && action.payload.qty && action.payload.qty > 0
      ? allow
      : reject)({
      ...action,
      payload: {
        ...action.payload,
        offer: getState().offers.byId[action.payload.offerID] || null,
      },
    });
  },
  process(_, dispatch, done) {
    dispatch(NavigationActions.navigate({ routeName: 'Cart' }));
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
      dispatch(setIsLoading(true));
      const { cartItems: { byId: cart }, user } = getState();
      deleteCartItemsIfEmpty(getState, dispatch);
      if (!(user && user.uid)) {
        return;
      }
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
        (getState().products.byId[productID] || { id: productID, name: '[???]', qty: 0 });
      const getProdName = prod => prod.name;
      errors.map(productID =>
        dispatch(addInfo(`No quedan ${getProdName(getProd(productID))} suficientes.`)),
      );
      multiDispatch(
        dispatch,
        ...errors.map((productId) => {
          const prod = getProd(productId);
          return changeCartProductQty(productId, prod.qty);
        }),
      );
      const { noPreAlert = false } = action.payload || {};
      !noPreAlert && dispatch(preAlertNoReserveCartProducts());
    } catch (err) {
      console.warn(err.message);
      dispatch(addError(err.message));
    } finally {
      dispatch(setIsLoading(false));
      done();
    }
  },
});

export const reserveCartLogic = createLogic({
  type: [postCartProduct.getType(), changeCartProductQty.getType()],
  process({ action }, dispatch, done) {
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
      setTimeout(onNeutral, 5000, getState, dispatch, done);
    } catch (err) {
      console.warn('preAlertNoReserveCartLogic', err);
      dispatch(addError(err.message));
      done();
    }
  },
});

export default reducer;

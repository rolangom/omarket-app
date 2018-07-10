// @flow
import { combineReducers } from 'redux';
import { createReducer, createAction } from 'redux-act';
import { createLogic } from 'redux-logic';
import { NavigationActions } from 'react-navigation';

import type { Cart, KeysOf } from '../../common/types';
import {
  deleteDoc,
  deleteImmutable,
  getRealtDocs,
  reduceFnByID,
  uniqFilterFn,
  upsertDoc,
  queryDoc, assert,
} from '../../common/utils';
import { addError, setIsLoading } from '../global';
import { clearCartItems, reserveCartProducts } from '../cart';

export const postCart = createAction(
  'POST_SAVED_CART',
  args => args,
  (args, doNavigateBack) => ({ doNavigateBack }),
);
export const postCurrentCart = createAction('POST_CURRENT_CART', name => ({ name }));
export const fetchCarts = createAction('FETCH_SAVED_CARTS');
export const setSavedCarts = createAction('SET_SAVED_CARTS');
export const saveCart = createAction('SAVE_CART');
export const deleteCart = createAction('DELETE_CART');
export const requestDeleteCart = createAction('REQ_DELETE_CART', (arg) => arg, (arg, goBack) => ({ goBack }));

const byId = createReducer(
  {
    [setSavedCarts]: (state: KeysOf<Cart>, carts: Cart[]) =>
      carts.reduce(reduceFnByID, {}),
    [saveCart]: (state: KeysOf<Cart>, cart: Cart) => ({
      ...state,
      [cart.id]: cart,
    }),
    [deleteCart]: (state: KeysOf<Cart>, cartID: string) =>
      deleteImmutable(state, cartID),
  },
  {},
);

const allIds = createReducer(
  {
    [setSavedCarts]: (state: string[], carts: Cart[]) =>
      carts.map((it: Cart) => it.id),
    [saveCart]: (state: string[], cart: Cart) =>
      state.concat(cart.id).filter(uniqFilterFn),
    [deleteCart]: (state: string[], cartID: string) =>
      state.filter((id: string) => id !== cartID),
  },
  [],
);

const reducer = combineReducers({
  byId,
  allIds,
});

export const fetchCartsLogic = createLogic({
  type: fetchCarts.getType(),
  validate({ getState, action }, allow, reject) {
    const { user } = getState();
    (user ? allow : reject)(action);
  },
  process: async ({ firebase, getState }, dispatch, done) => {
    try {
      dispatch(setIsLoading(true));
      const { user: { uid } } = getState();
      const docsSnapshots = await queryDoc(firebase, `users/${uid}/savedCarts`);
      const carts = getRealtDocs(docsSnapshots);
      dispatch(setSavedCarts(carts));
    } catch (error) {
      console.warn('fetchCartsLogic error', error);
      dispatch(addError(error.message));
    } finally {
      dispatch(setIsLoading(false));
      done();
    }
  },
});

export const postCurrentCartLogic = createLogic({
  type: postCurrentCart.getType(),
  latest: true,
  transform({ action, getState }, next, reject) {
    const today = new Date();
    const { name = today.toLocaleString() } = action.payload || {};
    const { cartItems: { allIds: cartIds } } = getState();
    cartIds.length > 0
      ? next({
        ...action,
        payload: {
          ...action.payload,
          name,
          createdAt: today.getTime(),
        },
      })
      : reject(action);
  },
  process: async ({ getState, action, firebase }, dispatch, done) => {
    try {
      console.log('postCurrentCartLogic start');
      dispatch(setIsLoading(true));
      const token = await firebase.auth().currentUser.getIdToken();
      const resp = await fetch(
        // 'http://localhost:5000/shop-f518d/us-central1/reserveProducts',
        'https://us-central1-shop-f518d.cloudfunctions.net/reserveProducts',
        {
          method: 'POST',
          headers: {
            'id-token': token,
            'content-type': 'application/json',
          },
        },
      );
      const jsonResp = await resp.json();
      assert(resp.ok, jsonResp.message);
      const { cartItems: { byId: content } } = getState();
      const { name, createdAt } = action.payload;
      const cart: Cart = {
        name,
        createdAt,
        content,
      };
      dispatch(postCart(cart));
      dispatch(clearCartItems());
      dispatch(reserveCartProducts({ noPreAlert: true }));
    } catch (err) {
      console.warn('postCurrentCartLogic', err);
      dispatch(addError(err.message));
    } finally {
      dispatch(setIsLoading(false));
      done();
    }
  },
});

export const postCartLogic = createLogic({
  type: postCart.getType(),
  process: async ({ firebase, action, getState }, dispatch, done) => {
    try {
      dispatch(setIsLoading(true));
      const { user: { uid } } = getState();
      const { id, ...data } = action.payload;
      console.log('postCartLogic', id, data);
      const doc = await upsertDoc(firebase, `users/${uid}/savedCarts`, {
        key: id,
        ...data,
      });
      const newCart = {
        id: id || doc.key,
        ...data,
      };
      dispatch(saveCart(newCart));
    } catch (error) {
      console.warn('postCartLogic error', error);
      dispatch(addError(error.message));
    } finally {
      dispatch(setIsLoading(false));
      done();
    }
  },
});

export const deleteCartLogic = createLogic({
  type: requestDeleteCart.getType(),
  process: async ({ getState, firebase, action }, dispatch, done) => {
    try {
      dispatch(setIsLoading(true));
      const { user: { uid } } = getState();
      const { payload: id, meta: { goBack = true } = {} } = action;
      await deleteDoc(firebase, `users/${uid}/savedCarts/${id}`);
      dispatch(deleteCart(id));
      goBack && dispatch(NavigationActions.back());
    } catch (error) {
      console.warn('deleteCartLogic error', error);
      dispatch(addError(error.message));
    } finally {
      dispatch(setIsLoading(false));
      done();
    }
  },
});

export default reducer;

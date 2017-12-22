// @flow
import { combineReducers } from 'redux';
import { createAction, createReducer } from 'redux-act';
import { createLogic } from 'redux-logic';
import { NavigationActions } from 'react-navigation';

import type { CartItem, KeysOf } from '../../config/types';
import { setImmutable, deleteImmutable } from '../../utils';

export const postCartProduct = createAction('POST_CART_PRODUCT', (productID: string, qty: number) => ({ productID, qty }));
export const changeCartProductQty = createAction('CHANGE_CART_PRODUCT_QTY', (productID: string, qty: number) => ({ productID, qty }));
export const increaseCartProduct = createAction('INCREASE_CART_PRODUCT');
export const reduceCartProduct = createAction('REDUCE_CART_PRODUCT');
export const deleteCartProduct = createAction('DELETE_CART_PRODUCT');

const byId = createReducer({
  [postCartProduct]: (state: KeysOf<CartItem>, item: CartItem) => setImmutable(state, `${item.productID}`, item),
  [changeCartProductQty]: (state: KeysOf<CartItem>, { productID, qty }) => setImmutable(state, `${productID}.qty`, qty),
  [increaseCartProduct]: (state: KeysOf<CartItem>, productID) => setImmutable(state, `${productID}.qty`, state[productID].qty + 1),
  [reduceCartProduct]: (state: KeysOf<CartItem>, productID) => setImmutable(state, `${productID}.qty`, state[productID].qty - 1),
  [deleteCartProduct]: (state: KeysOf<CartItem>, productID) => deleteImmutable(state, productID),
}, {});

const allIds = createReducer({
  [postCartProduct]: (state: string[], item: CartItem) => Array.from(new Set(state.concat(item.productID))),
  [deleteCartProduct]: (state: string[], productID) => state.filter((id: string) => id !== productID),
}, []);

const reducer = combineReducers({
  byId,
  allIds,
});


export const postCardProductLogic = createLogic({
  type: postCartProduct.getType(),
  validate({ action }, allow, reject) {
    (action.payload.qty > 0 ? allow : reject)(action);
  },
  process({ }, dispatch, done) {
    dispatch(NavigationActions.navigate({ routeName: 'Cart' }));
    done();
  },
});

export const deleteCartItemIfEmptyLogic = createLogic({
  type: changeCartProductQty.getType(),
  process({ getState, action }, dispatch, done) {
    const cartItem: CartItem = getState().cartItems.byId[action.payload.productID];
    cartItem && cartItem.qty <= 0 && dispatch(deleteCartProduct(action.payload.productID));
    done();
  },
});

export default reducer;

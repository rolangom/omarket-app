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
} from '../../common/utils';

export const postCartProduct = createAction(
  'POST_CART_PRODUCT',
  (productID: string, qty: number) => ({ productID, qty }),
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

const byId = createReducer(
  {
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
  validate({ action }, allow, reject) {
    (action.payload && action.payload.qty && action.payload.qty > 0
      ? allow
      : reject)(action);
  },
  process(_, dispatch, done) {
    dispatch(NavigationActions.navigate({ routeName: 'Cart' }));
    done();
  },
});

export const deleteCartItemIfEmptyLogic = createLogic({
  type: changeCartProductQty.getType(),
  process({ getState, action }, dispatch, done) {
    const cartItem: CartItem = getState().cartItems.byId[
      action.payload.productID
    ];
    cartItem &&
      cartItem.qty <= 0 &&
      dispatch(deleteCartProduct(action.payload.productID));
    done();
  },
});

export default reducer;

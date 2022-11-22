// @flow
import { combineReducers } from 'redux';
import { createAction, createReducer } from 'redux-act';
import { createLogic } from 'redux-logic';

import type { CartItem, KeysOf, Product } from '../../common/types';
import { setIsLoading, addError } from '../global';
import {
  getFmtDocs,
  reduceFnByID,
  setImmutable,
  sortBy,
} from '../../common/utils';
import {
  postCartProduct,
  incrCartProduct,
  changeCartProductQty,
} from 'src/ducks/cart';

/**
 * @deprecated use listener
 */
export const fetchProducts = createAction(
  'FETCH_PRODUCTS',
  (force: boolean = false) => ({ force }),
);
export const setProducts = createAction('SET_PRODUCTS');

/**
 * @deprecated use listener
 */
export const fetchProductsLogic = createLogic({
  type: fetchProducts.getType(),
  validate({ action }, allow, reject) {
    const { force } = action.payload;
    (force ? allow : reject)(action);
  },
  process: async ({ db }, dispatch, done) => {
    dispatch(setIsLoading(true));
    try {
      const docsSnapshots = await db
        .collection('products')
        .where('isActive', '==', true)
        .get();
      const products = sortBy(getFmtDocs(docsSnapshots), 'orderID', true);
      dispatch(setProducts(products));
    } catch (error) {
      console.warn('fetchProducts', error);
      dispatch(addError(error.message));
    } finally {
      dispatch(setIsLoading(false));
      done();
    }
  },
});

const byId = createReducer(
  {
    [setProducts]: (state: KeysOf<Product>, products: Product[]) =>
      products.reduce(reduceFnByID, {}),
    // [postCartProduct]: (state: KeysOf<Product>, item: CartItem) =>
    //   setImmutable(state, `${item.productID}.qty`, state[item.productID].qty - 1),
    // [incrCartProduct]: (state: KeysOf<Product>, item: CartItem) =>
    //   setImmutable(state, `${item.productID}.qty`, state[item.productID].qty - 1),
    // [changeCartProductQty]: (state: KeysOf<Product>, item: CartItem) =>
    //   setImmutable(state, `${item.productID}.qty`, state[item.productID].qty - item.qty),
  },
  {},
);

const allIds = createReducer(
  {
    [setProducts]: (state: string[], products: Product[]) =>
      products.map((it: Product) => it.id),
  },
  [],
);

const reducer = combineReducers({
  byId,
  allIds,
});

export default reducer;

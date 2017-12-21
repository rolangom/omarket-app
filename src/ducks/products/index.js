// @flow
import { createAction, createReducer } from 'redux-act';
import { createLogic } from 'redux-logic';

import type { Product as ProductType } from '../../config/types';
import { setIsLoading, addError } from '../global';
import { getDocs } from '../../utils';

export const fetchProducts = createAction('FETCH_PRODUCTS', (force: boolean = false) => ({ force }));
export const setProducts = createAction('SET_PRODUCTS');

export const fetchProductsLogic = createLogic({
  type: fetchProducts.getType(),
  validate({ action }, allow, reject) {
    const { force } = action.payload;
    (force ? allow : reject)(action);
  },
  process: async ({ db }, dispatch, done) => {
    dispatch(setIsLoading(true));
    try {
      const docsSnapshots = await db.collection('products').where('isActive', '==', true).get();
      const products = getDocs(docsSnapshots);
      dispatch(setProducts(products));
    } catch (error) {
      console.error('fetchProducts', error);
      dispatch(addError(error));
    } finally {
      dispatch(setIsLoading(false));
      done();
    }
  },
});

const reducer = createReducer({
  [setProducts]: (state, categories: ProductType[]) => categories,
}, []);

export default reducer;


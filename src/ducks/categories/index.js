// @flow
import { createAction, createReducer } from 'redux-act';
import { createLogic } from 'redux-logic';

import type { Category as CategoryType } from '../../config/types';
import { setIsLoading, addError } from '../global';
import { getDocs } from '../../utils';

export const fetchCategories = createAction('FETCH_CATEGORIES', (force: boolean = false) => ({ force }));
export const setCategories = createAction('SET_CATEGORIES');

export const fetchCategoriesLogic = createLogic({
  type: fetchCategories.getType(),
  validate({ action }, allow, reject) {
    const { force } = action.payload;
    (force ? allow : reject)(action);
  },
  process: async ({ db }, dispatch, done) => {
    dispatch(setIsLoading(true));
    try {
      const docsSnapshots = await db.collection('categories').get();
      const categories = getDocs(docsSnapshots);
      dispatch(setCategories(categories));
    } catch (error) {
      console.error('fetchCategories', error);
      dispatch(addError(error));
    } finally {
      dispatch(setIsLoading(false));
      done();
    }
  },
});

const reducer = createReducer({
  [setCategories]: (state, categories: CategoryType[]) => categories,
}, []);

export default reducer;

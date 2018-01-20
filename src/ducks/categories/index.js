// @flow
import { combineReducers } from 'redux';
import { createAction, createReducer } from 'redux-act';
import { createLogic } from 'redux-logic';

import type { Category, KeysOf } from '../../common/types';
import { setIsLoading, addError } from '../global';
import { getFmtDocs, reduceFnByID, sortBy } from '../../common/utils';

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
      const categories = sortBy(getFmtDocs(docsSnapshots), 'orderID', true);
      dispatch(setCategories(categories));
    } catch (error) {
      console.warn('fetchCategories error', error);
      dispatch(addError(error.message));
    } finally {
      dispatch(setIsLoading(false));
      done();
    }
  },
});

const byId = createReducer({
  [setCategories]: (state: KeysOf<Category>, categories: Category[]) =>
    categories.reduce(reduceFnByID, {}),
}, {});

const allIds = createReducer({
  [setCategories]: (state: string[], categories: Category[]) =>
    categories.map((it: Category) => it.id),
}, []);

const reducer = combineReducers({
  byId,
  allIds,
});

export default reducer;

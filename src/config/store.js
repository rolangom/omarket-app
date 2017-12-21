// @flow
import { createStore, combineReducers, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import { createLogicMiddleware } from 'redux-logic';

import navReducer from '../navigators/reducer';
import globalReducer, { initAppDataLogic } from '../ducks/global';
import categoriesReducer, { fetchCategoriesLogic } from '../ducks/categories';
import productsReducer, { fetchProductsLogic } from '../ducks/products';
import adsReducer, { fetchAdsLogic } from '../ducks/ads';

import firebase, { db } from './fbase';

const configureStore = () => {
  const reducers = combineReducers({
    nav: navReducer,
    global: globalReducer,
    categories: categoriesReducer,
    products: productsReducer,
    ads: adsReducer,
  });

  return createStore(
    reducers,
    applyMiddleware(
      logger,
      createLogicMiddleware([
        fetchAdsLogic,
        fetchCategoriesLogic,
        fetchProductsLogic,
        initAppDataLogic,
      ], { firebase, db }),
    ),
  );
};

export default configureStore;

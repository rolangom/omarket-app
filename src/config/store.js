// @flow
import { createStore, combineReducers, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import { createLogicMiddleware } from 'redux-logic';

import navReducer from '../navigators/reducer';
import globalReducer, { initAppDataLogic } from '../ducks/global';
import categoriesReducer, { fetchCategoriesLogic } from '../ducks/categories';
import productsReducer, { fetchProductsLogic } from '../ducks/products';
import adsReducer, { fetchAdsLogic } from '../ducks/ads';
import cartItemsReducer, { deleteCartItemIfEmptyLogic, postCardProductLogic } from '../ducks/cart';
import userReducer, { loginWithFacebookLogic, logoutLogic, postUserLogic, getUserLogic } from '../ducks/user';

import firebase, { db } from './fbase';

const originalSend = XMLHttpRequest.prototype.send;
XMLHttpRequest.prototype.send = function(body) {
  if (body === '') {
    originalSend.call(this);
  } else {
    originalSend.call(this, body);
  }
};

const configureStore = () => {
  const reducers = combineReducers({
    nav: navReducer,
    global: globalReducer,
    categories: categoriesReducer,
    products: productsReducer,
    ads: adsReducer,
    cartItems: cartItemsReducer,
    user: userReducer,
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
        loginWithFacebookLogic,
        logoutLogic,
        postUserLogic,
        getUserLogic,
        deleteCartItemIfEmptyLogic,
        postCardProductLogic,
      ], { firebase, db }),
    ),
  );
};

export default configureStore;

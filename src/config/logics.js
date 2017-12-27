

import { initAppDataLogic } from '../ducks/global';
import { fetchCategoriesLogic } from '../ducks/categories';
import { fetchProductsLogic } from '../ducks/products';
import { fetchAdsLogic } from '../ducks/ads';
import { deleteCartItemIfEmptyLogic, postCardProductLogic } from '../ducks/cart';
import { loginWithFacebookLogic, logoutLogic, postUserLogic, getUserLogic } from '../ducks/user';

export default [
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
];



import { initAppDataLogic } from '../ducks/global';
import { fetchCategoriesLogic } from '../ducks/categories';
import { fetchProductsLogic } from '../ducks/products';
import { fetchAdsLogic } from '../ducks/ads';
import { deleteCartItemIfEmptyLogic, postCardProductLogic } from '../ducks/cart';
import { loginWithFacebookLogic, logoutLogic, postUserLogic, getUserLogic } from '../ducks/user';
import { fetchAddressesLogic, postAddressLogic, deleteAddressLogic } from '../ducks/addresses';
import { fetchCreditcardsLogic, postCreditcardLogic, deleteCreditcardLogic } from '../ducks/credit-cards';
import { postOrderRequestLogic, fetchOrderRequestsLogic } from '../ducks/order-requests';

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
  fetchAddressesLogic,
  postAddressLogic,
  deleteAddressLogic,
  fetchCreditcardsLogic,
  postCreditcardLogic,
  deleteCreditcardLogic,
  postOrderRequestLogic,
  fetchOrderRequestsLogic,
];

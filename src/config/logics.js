import {
  initAppDataLogic,
  fetchConfigsLogic,
  searchTermLogic,
} from '../ducks/global';
import { fetchCategoriesLogic } from '../ducks/categories';
import { fetchProductsLogic } from '../ducks/products';
import { fetchAdsLogic } from '../ducks/ads';
import {
  postCardProductLogic,
  reserveCartLogic,
  requestReserveCartProdLogic,
  preAlertNoReserveCartLogic,
  setCartProductsLogic,
} from '../ducks/cart';
import {
  loginWithFacebookLogic,
  logoutLogic,
  postUserLogic,
  getUserLogic,
  getPointsLogic,
  updateTimeWeekdaysLogic,
} from '../ducks/user';
import {
  fetchAddressesLogic,
  postAddressLogic,
  deleteAddressLogic,
} from '../ducks/addresses';
import {
  fetchCreditcardsLogic,
  postCreditcardLogic,
  deleteCreditcardLogic,
} from '../ducks/credit-cards';
import {
  postOrderRequestLogic,
  postOrderReqRatingLogic,
} from '../ducks/order-requests';
import { fetchOffersLogic } from '../ducks/offers';
import {
  fetchCartsLogic,
  deleteCartLogic,
  postCartLogic,
  postCurrentCartLogic,
  applyProductsToCartLogic,
} from '../ducks/savedCarts';

export default [
  fetchAdsLogic,
  fetchCategoriesLogic,
  fetchProductsLogic,
  searchTermLogic,
  initAppDataLogic,
  fetchConfigsLogic,
  loginWithFacebookLogic,
  logoutLogic,
  postUserLogic,
  getUserLogic,
  getPointsLogic,
  updateTimeWeekdaysLogic,
  postCardProductLogic,
  fetchAddressesLogic,
  postAddressLogic,
  deleteAddressLogic,
  fetchCreditcardsLogic,
  postCreditcardLogic,
  deleteCreditcardLogic,
  postOrderRequestLogic,
  postOrderReqRatingLogic,
  fetchOffersLogic,
  reserveCartLogic,
  requestReserveCartProdLogic,
  fetchCartsLogic,
  deleteCartLogic,
  postCartLogic,
  postCurrentCartLogic,
  preAlertNoReserveCartLogic,
  applyProductsToCartLogic,
  setCartProductsLogic,
];

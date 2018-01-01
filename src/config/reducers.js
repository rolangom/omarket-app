import navReducer from '../navigators/reducer';
import globalReducer from '../ducks/global';
import categoriesReducer from '../ducks/categories';
import productsReducer from '../ducks/products';
import adsReducer from '../ducks/ads';
import cartItemsReducer from '../ducks/cart';
import userReducer from '../ducks/user';
import addressesReducer from '../ducks/addresses';
import creditCardsReducer from '../ducks/credit-cards';

const reducers = {
  nav: navReducer,
  global: globalReducer,
  categories: categoriesReducer,
  products: productsReducer,
  ads: adsReducer,
  cartItems: cartItemsReducer,
  user: userReducer,
  addresses: addressesReducer,
  creditCards: creditCardsReducer,
};

export default reducers;

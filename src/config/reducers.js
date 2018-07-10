import nav from '../navigators/reducer';
import global from '../ducks/global';
import categories from '../ducks/categories';
import products from '../ducks/products';
import ads from '../ducks/ads';
import cartItems from '../ducks/cart';
import savedCarts from '../ducks/savedCarts';
import user from '../ducks/user';
import addresses from '../ducks/addresses';
import creditCards from '../ducks/credit-cards';
import orders from '../ducks/order-requests';
import offers from '../ducks/offers';

const reducers = {
  nav,
  global,
  categories,
  products,
  ads,
  cartItems,
  user,
  addresses,
  creditCards,
  orders,
  offers,
  savedCarts,
};

export default reducers;

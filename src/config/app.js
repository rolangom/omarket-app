import firebase, { db,  } from './fbase';
import { setUserLogged } from '../ducks/user';
import { initAppData, addRawError } from '../ducks/global';
import { getFmtDocs, sortBy } from '../common/utils';
import { setOrderRequests } from '../ducks/order-requests';
import { setProducts } from '../ducks/products';

const bindDispatch = (dispatch, action) => payload =>
  dispatch(action(payload));

const listenProductsChanges = dispatch =>
  db
    .collection('products')
    .where('isActive', '==', true)
    .onSnapshot(
      docsSnapshots => dispatch(setProducts(sortBy(getFmtDocs(docsSnapshots), 'orderID', true))),
      bindDispatch(dispatch, addRawError),
    );

const listenAuthChanges = dispatch =>
  firebase
    .auth()
    .onAuthStateChanged(
      bindDispatch(dispatch, setUserLogged),
      bindDispatch(dispatch, addRawError),
    );

const initApp = store => {
  store.dispatch(initAppData());
  const authUnsubscr = listenAuthChanges(store.dispatch);
  const prodsUnsubscr = listenProductsChanges(store.dispatch);
  return () => [authUnsubscr, prodsUnsubscr]
    .forEach(unsubscribe => unsubscribe());
};

export const initOrderRequestsSubcr = dispatch => {
  const { uid } = firebase.auth().currentUser;
  return db
    .collection('orders')
    .where('uid', '==', uid)
    .onSnapshot(
      querySnapshot => dispatch(setOrderRequests(sortBy(getFmtDocs(querySnapshot), 'createdAt', false))),
      bindDispatch(dispatch, addRawError),
    );
};

export default initApp;

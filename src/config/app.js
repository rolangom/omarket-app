import firebase, { db } from './fbase';
import { setUserLogged } from '../ducks/user';
import { initAppData, addRawError } from '../ducks/global';
import { getFmtDocs, sortBy } from '../common/utils';
import { setOrderRequests } from '../ducks/order-requests';

const bindDispatch = (store, action) => payload => store.dispatch(action(payload));

const initApp = (store) => {
  store.dispatch(initAppData());
  return firebase
    .auth()
    .onAuthStateChanged(
      bindDispatch(store, setUserLogged),
      bindDispatch(store, addRawError),
    );
};

export const initOrderRequestsSubcr = (dispatch) => {
  const { uid } = firebase.auth().currentUser;
  return db
    .collection('orders')
    .where('uid', '==', uid)
    .onSnapshot(
      querySnapshot => dispatch(setOrderRequests(sortBy(getFmtDocs(querySnapshot), 'createdAt', false))),
      error => dispatch(addRawError(error)),
    );
};

export default initApp;

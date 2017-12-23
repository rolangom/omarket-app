
import firebase from './fbase';
import { setUserLogged } from '../ducks/user';
import { initAppData, addRawError } from '../ducks/global';

const dispatch = (store, action) => payload =>
  store
    .dispatch(action(payload));

const initApp = (store) => {
  store.dispatch(initAppData());
  const unsubscr =
    firebase
      .auth()
      .onAuthStateChanged(dispatch(store, setUserLogged), dispatch(store, addRawError));
  return unsubscr;
};

export default initApp;

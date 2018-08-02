// @flow
// import { combineReducers } from 'redux';
import { createAction, createReducer } from 'redux-act';
import { createLogic } from 'redux-logic';
import Expo from 'expo';

import type { User } from '../../common/types';
import { setIsLoading, addError } from '../global';
import { filterKeys, queryDoc, upsertDoc, multiDispatch } from '../../common/utils';
import { FACEBOOK_APPID } from '../../common/utils/constants';
import { setAddresses, fetchAddresses } from '../addresses';
import { setCreditcards, fetchCreditcards } from '../credit-cards';
import { setCartProducts, reserveCartProducts } from '../cart';

export const loginWithFacebook = createAction('LOG_IN_WITH_FACEBOOK');
export const logout = createAction('LOG_OUT');
export const setUserLogged = createAction('SET_USER_LOGGED');
export const postUser = createAction('POST_USER');
export const getUser = createAction('GET_USER');
export const mergeUser = createAction('MERGE_USER');
export const setUseNCF = createAction('SET_USE_NCF');

const requiredKeys = [
  'displayName',
  'email',
  'phoneNumber',
  'gender',
  'photoURL',
  'uid',
  'birthday',
  'taxInfo',
  'usesNCF',
];

const reducer = createReducer(
  {
    [mergeUser]: (state: ?User, user: User) => ({ ...state, ...user }),
    [setUserLogged]: (state: ?User, user: ?User) =>
      user ? filterKeys(user, requiredKeys) : null,
    [setUseNCF]: (state: ?User, usesNCF: boolean) => ({ ...state, usesNCF }),
  },
  null,
);

const onLoggedInFuncs = async (action, firebase, dispatch) => {
  const { uid } = action.payload || action;
  const doc = await queryDoc(firebase, `users/${uid}/user`);
  // const doc = await db.collection('users').doc(uid);
  const user = doc.exists && { uid, ...doc.val() };
  // const user = doc.exists && { uid, ...doc.data() };
  user && multiDispatch(
    dispatch,
    mergeUser(user),
    // reserveCartProducts(),
    fetchAddresses(),
    fetchCreditcards(),
  );
  firebase
    .database()
    .ref(`users/${uid}/cart`)
    .on(
      'value',
      snapshot => dispatch(setCartProducts(snapshot.val())),
      error => dispatch(addError(error.message)),
    );
};

const onLoggedOutFuncs = (action, firebase) => {
  const { uid } = action;
  uid && firebase
    .database()
    .ref(`users/${uid}/cart`)
    .off();
};

export const getUserLogic = createLogic({
  type: setUserLogged.getType(),
  validate({ action, getState }, allow) {
    const { user } = getState();
    const { uid } = user || {};
    allow({
      ...action,
      isLogged: !!action.payload,
      uid,
    });
  },
  process: async ({ action, firebase }, dispatch, done) => {
    try {
      action.isLogged
        ? await onLoggedInFuncs(action, firebase, dispatch)
        : onLoggedOutFuncs(action, firebase);
    } catch (err) {
      console.warn('getUserLogic error', err);
      dispatch(addError(err.message));
    } finally {
      dispatch(setIsLoading(false));
      done();
    }
  },
});

export const postUserLogic = createLogic({
  type: postUser.getType(),
  process: async ({ firebase, db, action }, dispatch, done) => {
    try {
      console.log('action', action);
      dispatch(setIsLoading(true));
      const { currentUser: { uid } } = firebase.auth();
      const { uid: _, ...data } = action.payload;
      const { taxInfo: { id } = {} } = action.payload;

      const resp = await fetch(
        `https://us-central1-shop-f518d.cloudfunctions.net/queryDgiiBy?id=${id}`,
      );
      const { name, commercialName } = await resp.json();
      const taxInfo = resp.ok ? { id, name, commercialName } : {};
      await upsertDoc(firebase, `users/${uid}`, {
        key: 'user',
        ...data,
        taxInfo,
      });
      // await db.collection('users').doc(uid).set(data);
      dispatch(mergeUser({ ...action.payload, taxInfo }));
    } catch (err) {
      console.warn('postUserLogic error', err);
      dispatch(addError(err.message));
    } finally {
      dispatch(setIsLoading(false));
      done();
    }
  },
});

export const loginWithFacebookLogic = createLogic({
  type: loginWithFacebook.getType(),
  warnTimeout: 0,
  process: async ({ firebase }, dispatch, done) => {
    try {
      dispatch(setIsLoading(true));
      const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync(
        FACEBOOK_APPID,
        { permissions: ['public_profile', 'email'] },
      );
      if (type === 'success') {
        const credential = firebase.auth.FacebookAuthProvider.credential(token);
        await firebase.auth().signInWithCredential(credential);
      } else {
        dispatch(addError('Solicitud cancelada por usuario.'));
      }
    } catch (err) {
      console.warn('loginWithFacebookLogic error', err);
      dispatch(addError(err.message));
    } finally {
      dispatch(setIsLoading(false));
      done();
    }
  },
});

export const logoutLogic = createLogic({
  type: logout.getType(),
  process: async ({ firebase }, dispatch, done) => {
    try {
      dispatch(setIsLoading(true));
      multiDispatch(dispatch, setAddresses([]), setCreditcards([]));
      await firebase.auth().signOut();
    } catch (err) {
      console.warn('loginWithFacebookLogic error', err);
      dispatch(addError(err.message));
    } finally {
      dispatch(setIsLoading(false));
      done();
    }
  },
});

export default reducer;

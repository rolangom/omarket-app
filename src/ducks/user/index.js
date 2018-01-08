// @flow
// import { combineReducers } from 'redux';
import { createAction, createReducer } from 'redux-act';
import { createLogic } from 'redux-logic';
import Expo from 'expo';

import type { User } from '../../common/types';
import { setIsLoading, addError } from '../global';
import { filterKeys, setImmutable } from '../../common/utils';
import { FACEBOOK_APPID } from '../../common/utils/constants';
import { setAddresses, fetchAddresses } from '../addresses';
import { setCreditcards, fetchCreditcards } from '../credit-cards';

export const loginWithFacebook = createAction('LOG_IN_WITH_FACEBOOK');
export const logout = createAction('LOG_OUT');
export const setUserLogged = createAction('SET_USER_LOGGED_IN');
export const setUserLoggedOut = createAction('SET_USER_LOGGED_OUT');
export const postUser = createAction('POST_USER');
export const getUser = createAction('GET_USER');
export const mergeUser = createAction('MERGE_USER');

const requiredKeys = ['displayName', 'email', 'phoneNumber', 'gender', 'photoURL', 'uid', 'birthday', 'taxInfo'];

const reducer = createReducer({
  [mergeUser]: (state, user: User) => ({ ...state, ...user }),
  [setUserLogged]: (state: ?User, user: ?User) => user ? filterKeys(user, requiredKeys) : null,
  [setUserLoggedOut]: () => null,
}, null);

export const getUserLogic = createLogic({
  type: setUserLogged.getType(),
  validate({ action }, allow, reject) {
    (action.payload ? allow : reject)(action);
  },
  process: async ({ action, db }, dispatch, done) => {
    try {
      const { uid } = action.payload;
      const doc = await db.collection('users').doc(uid).get();
      const user = doc.exists && { uid: doc.id, ...doc.data() };
      user && dispatch(mergeUser(user));
      dispatch(fetchAddresses());
      dispatch(fetchCreditcards());
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
  transform({ action }, next) {
    next(setImmutable(
      action,
      'payload.birthday',
      new Date(action.payload.birthday || null),
    ));
  },
  process: async ({ db, action }, dispatch, done) => {
    try {
      dispatch(setIsLoading(true));
      const { uid, id, ...data } = action.payload;
      await db.collection('users')
        .doc(uid)
        .set(data);
      dispatch(mergeUser(action.payload));
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
      dispatch(setAddresses([]));
      dispatch(setCreditcards([]));
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

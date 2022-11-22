// @flow
// import { combineReducers } from 'redux';
import { createAction, createReducer } from 'redux-act';
import { createLogic } from 'redux-logic';
import Expo from 'expo';

import type { User } from 'src/common/types';
import { setIsLoading, addError } from '../global';
import {
  filterKeys,
  queryDoc,
  upsertDoc,
  multiDispatch,
} from 'src/common/utils';
import { FACEBOOK_APPID, defaultEmptyObj } from 'src/common/utils/constants';
import { setAddresses, fetchAddresses } from '../addresses';
import { setCreditcards, fetchCreditcards } from '../credit-cards';
import { setCartProducts, reserveCartProducts } from '../cart';
import { fetchOffers } from '../offers';

export const loginWithFacebook = createAction('LOG_IN_WITH_FACEBOOK');
export const logout = createAction('LOG_OUT');
export const setUserLogged = createAction('SET_USER_LOGGED');
export const postUser = createAction('POST_USER');
export const getUser = createAction('GET_USER');
export const mergeUser = createAction('MERGE_USER');
export const setUseNCF = createAction('SET_USE_NCF');
export const getPoints = createAction('GET_USERS_POINTS');
export const updateTimeWeekdays = createAction('UPDATE_TIME_WEEKDAYS');

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
  'points',
  'avWds',
  'avTmByWd',
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

const getUserPoints = async (firebase, uid) => {
  const docPtsSnapshot = await firebase
    .firestore()
    .doc(`users/${uid}`)
    .get();
  return (docPtsSnapshot.exists && docPtsSnapshot.data().points) || 0;
};

const onLoggedInFuncs = async (action, firebase, dispatch) => {
  const { uid } = action.payload || action;
  const doc = await queryDoc(firebase, `users/${uid}/user`);
  // const doc = await db.collection('users').doc(uid);
  const points = await getUserPoints(firebase, uid);
  const user = doc.exists && { uid, points, ...doc.val() };
  // const user = doc.exists && { uid, ...doc.data() };

  const onError = (error: Error) => {
    console.warn('onLoggedInFuncs error', error);
    dispatch(addError(error.message));
  };
  user &&
    multiDispatch(
      dispatch,
      mergeUser(user),
      // reserveCartProducts(),
      fetchAddresses(),
      fetchCreditcards(),
      fetchOffers(),
    );
  firebase
    .database()
    .ref(`users/${uid}/cart`)
    .on(
      'value',
      snapshot => dispatch(setCartProducts(snapshot.val())),
      onError,
    );
};

const onLoggedOutFuncs = (action, firebase, dispatch) => {
  const { uid } = action;
  uid &&
    firebase
      .database()
      .ref(`users/${uid}/cart`)
      .off();
  dispatch(fetchOffers());
};

export const getPointsLogic = createLogic({
  type: getPoints.getType(),
  process: async ({ firebase, getState }, dispatch, done) => {
    try {
      const { user } = getState();
      const points = await getUserPoints(firebase, user.uid);
      dispatch(
        mergeUser({
          points,
        }),
      );
    } catch (err) {
      console.warn('postUserLogic error', err);
      dispatch(addError(err.message));
    } finally {
      done();
    }
  },
});

export const getUserLogic = createLogic({
  type: setUserLogged.getType(),
  validate({ action, getState }, allow) {
    const { user } = getState();
    const { uid } = user || defaultEmptyObj;
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
        : onLoggedOutFuncs(action, firebase, dispatch);
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
      const { uid: _, points, ...data } = action.payload;
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
        await firebase.auth().signInAndRetrieveDataWithCredential(credential);
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

export const updateTimeWeekdaysLogic = createLogic({
  type: updateTimeWeekdays.getType(),
  validate({ action, getState }, allow, reject) {
    const {
      avTmByWd: newAvTmByWd,
      avWds: newAvWds,
    }: User = action.payload;
    const {
      user: {
        avTmByWd,
        avWds,
      },
    } = getState();
    console.log(
      'updateTimeWeekdaysLogic ',
      newAvTmByWd, avTmByWd, avWds, newAvWds,
      newAvTmByWd === avTmByWd, newAvWds === avWds
    );
    (newAvTmByWd === avTmByWd) && (newAvWds === avWds)
      ? reject(action)
      : allow(action);
  },
});

export default reducer;

// @flow
// import { combineReducers } from 'redux';
import { createAction, createReducer } from 'redux-act';
import { createLogic } from 'redux-logic';
import Expo from 'expo';

import type { User } from '../../config/types';
import { setIsLoading, addError } from '../global';
// import { deleteImmutable, getDocs, reduceFnByID, sortBy } from '../../utils';
import { FACEBOOK_APPID } from '../../config/constants';

export const loginWithFacebook = createAction('LOG_IN_WITH_FACEBOOK');
export const logout = createAction('LOG_OUT');
export const setUserLogged = createAction('SET_USER_LOGGED_IN');
export const setUserLoggedOut = createAction('SET_USER_LOGGED_OUT');

const reducer = createReducer({
  [setUserLogged]: (state: ?User, user: ?User) => user,
  [setUserLoggedOut]: () => null,
}, null);

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
      console.log('loginWithFacebookLogic', type, token);
      if (type === 'success') {
        const credential = firebase.auth.FacebookAuthProvider.credential(token);
        // Sign in with credential from the Facebook user.
        await firebase.auth().signInWithCredential(credential);

        // Get the user's name using Facebook's Graph API
        // const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
        // const jsonResp = await response.json();
        // console.log('loginWithFacebookLogic jsonResp', jsonResp);
      }
    } catch (err) {
      console.log('loginWithFacebookLogic error', err);
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
      await firebase.auth().signOut();
    } catch (err) {
      console.log('loginWithFacebookLogic error', err);
      dispatch(addError(err.message));
    } finally {
      dispatch(setIsLoading(false));
      done();
    }
  }
});

export default reducer;

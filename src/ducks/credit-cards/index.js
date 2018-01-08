// @flow
import { combineReducers } from 'redux';
import { createAction, createReducer } from 'redux-act';
import { createLogic } from 'redux-logic';
import { NavigationActions } from 'react-navigation';

import type { CreditCard, KeysOf } from '../../common/types';
import { setIsLoading, addError } from '../global';
import {
  deleteImmutable, getDocs, reduceFnByID, uniqFilterFn, upsertDoc, padStart, replace,
  upsertRealtDoc, getRealtDocs,
} from '../../common/utils';


export const fetchCreditcards = createAction('FETCH_CREDITCARDS');
export const setCreditcards = createAction('SET_CREDITCARDS');
export const postCreditcard = createAction('POST_CREDITCARD');
export const saveCreditcard = createAction('SAVE_CREDITCARD');
export const requestDeleteCreditcard = createAction('REQ_DELETE_CREDITCARD');
export const deleteCreditcard = createAction('DELETE_CREDITCARD');

const byId = createReducer({
  [setCreditcards]: (state: KeysOf<CreditCard>, creditCards: CreditCard[]) => creditCards.reduce(reduceFnByID, {}),
  [saveCreditcard]: (state: KeysOf<CreditCard>, creditCard: CreditCard) => ({ ...state, [creditCard.id]: creditCard }),
  [deleteCreditcard]: (state: KeysOf<CreditCard>, creditCardID: string) => deleteImmutable(state, creditCardID),
}, {});

const allIds = createReducer({
  [setCreditcards]: (state: string[], creditCards: CreditCard[]) => creditCards.map((it: CreditCard) => it.id),
  [saveCreditcard]: (state: string[], creditCard: CreditCard) => state.concat(creditCard.id).filter(uniqFilterFn),
  [deleteCreditcard]: (state: string[], creditCardID: string) => state.filter((id: string) => id !== creditCardID),
}, []);

export const fetchCreditcardsLogic = createLogic({
  type: fetchCreditcards.getType(),
  validate({ getState, action }, allow, reject) {
    const { user } = getState();
    (user ? allow : reject)(action);
  },
  process: async ({ db, getState, firebase }, dispatch, done) => {
    try {
      dispatch(setIsLoading(true));
      const { user: { uid } } = getState();
      // const docsSnapshots = await db.collection('users')
      //   .doc(uid)
      //   .collection('creditCards').get();
      const docsSnapshots = await firebase.database()
        .ref('users')
        .child(uid)
        .child('creditCards')
        .once('value');
      // const creditCards = getDocs(docsSnapshots);
      const creditCards = getRealtDocs(docsSnapshots);
      dispatch(setCreditcards(creditCards));
    } catch (error) {
      console.warn('fetchCreditcardsLogic error', error);
      dispatch(addError(error.message));
    } finally {
      dispatch(setIsLoading(false));
      done();
    }
  },
});

export const postCreditcardLogic = createLogic({
  type: postCreditcard.getType(),
  transform({ action }, next) {
    next({
      ...action,
      payload: {
        ...action.payload,
        number: replace(action.payload.number),
      },
    });
  },
  process: async ({ db, action, getState, firebase }, dispatch, done) => {
    try {
      dispatch(setIsLoading(true));
      const { user: { uid } } = getState();
      // const userRef = db.collection('users').doc(uid);
      // const collection = userRef.collection('creditCards');
      // const privCollection = userRef.collection('privCreditCards');
      const userRef = firebase.database().ref('users').child(uid);
      const collection = userRef.child('creditCards');
      const privCollection = userRef.child('privCreditCards');

      const { id, ...data } = action.payload;
      const number = padStart(data.number.slice(-4), data.number.length, 'X');
      const pubData: CreditCard = { ...action.payload, number };
      const doc = await upsertRealtDoc(pubData, collection);
      const newCreditCard = {
        id: id || doc.key || doc.id,
        ...pubData,
      };
      await upsertRealtDoc({ id: newCreditCard.id, ...data }, privCollection);
      dispatch(saveCreditcard(newCreditCard));
      dispatch(NavigationActions.back());
    } catch (error) {
      console.warn('postCreditcardLogic error', error);
      dispatch(addError(error.message));
    } finally {
      dispatch(setIsLoading(false));
      done();
    }
  },
});

export const deleteCreditcardLogic = createLogic({
  type: requestDeleteCreditcard.getType(),
  process: async ({ getState, db, action, firebase }, dispatch, done) => {
    try {
      dispatch(setIsLoading(true));
      const { user: { uid } } = getState();
      const { payload: id } = action;
      // const getUserSubCollect = (name: string) => db.collection('users')
      //   .doc(uid)
      //   .collection(name);
      const getUserSubCollect = (name: string) => firebase.database()
        .ref('users')
        .child(uid)
        .child(name);
      // await getUserSubCollect('creditCards').doc(id).delete();
      // await getUserSubCollect('privCreditCards').doc(id).delete();
      await getUserSubCollect('creditCards').child(id).remove();
      await getUserSubCollect('privCreditCards').child(id).remove();
      dispatch(deleteCreditcard(id));
      dispatch(NavigationActions.back());
    } catch (error) {
      console.warn('deleteCreditcardLogic error', error);
      dispatch(addError(error.message));
    } finally {
      dispatch(setIsLoading(false));
      done();
    }
  },
});

const reducer = combineReducers({
  byId,
  allIds,
});

export default reducer;


// @flow
import { combineReducers } from 'redux';
import { createAction, createReducer } from 'redux-act';
import { createLogic } from 'redux-logic';
import { NavigationActions } from 'react-navigation';

import type { CreditCard, KeysOf } from '../../common/types';
import { setIsLoading, addError } from '../global';
import { deleteImmutable, getDocs, reduceFnByID, uniqFilterFn, upsertDoc, padStart, replace } from '../../common/utils';


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
  process: async ({ db, getState }, dispatch, done) => {
    try {
      dispatch(setIsLoading(true));
      const { user: { uid } } = getState();
      const docsSnapshots = await db.collection('users')
        .doc(uid)
        .collection('creditCards').get();
      const creditCards = getDocs(docsSnapshots);
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
  process: async ({ db, action, getState }, dispatch, done) => {
    try {
      dispatch(setIsLoading(true));
      const { user: { uid } } = getState();
      const userRef = db.collection('users').doc(uid);
      const collection = userRef.collection('creditCards');
      const privCollection = userRef.collection('privCreditCards');
      const { id, ...data } = action.payload;
      const number = padStart(data.number.slice(-4), data.number.length, 'X');
      const pubData: CreditCard = { ...action.payload, number };
      const doc = await upsertDoc(pubData, collection);
      const newCreditCard = {
        id: id || doc.id,
        ...pubData,
      };
      await upsertDoc({ id: newCreditCard.id, ...data }, privCollection);
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
  process: async ({ getState, db, action }, dispatch, done) => {
    try {
      dispatch(setIsLoading(true));
      const { user: { uid } } = getState();
      const { payload: id } = action;
      const getUserSubCollect = (name: string) => db.collection('users')
        .doc(uid)
        .collection(name);
      await getUserSubCollect('creditCards').doc(id).delete();
      await getUserSubCollect('privCreditCards').doc(id).delete();
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


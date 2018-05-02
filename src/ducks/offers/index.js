// @flow
import { combineReducers } from 'redux';
import { createAction, createReducer } from 'redux-act';
import { createLogic } from 'redux-logic';

import type { Offer, KeysOf, Rel } from '../../common/types';
import { setIsLoading, addError } from '../global';
import { getFmtDocs, reduceFnByID } from '../../common/utils';

export const fetchOffers = createAction('FETCH_OFFERS', (force: boolean = false) => ({ force }));
export const setOffers = createAction('SET_OFFERS');

export const fetchOffersLogic = createLogic({
  type: fetchOffers.getType(),
  process: async ({ db }, dispatch, done) => {
    dispatch(setIsLoading(true));
    try {
      const today = new Date();
      const docsSnapshots = await db
        .collection('offers')
        .where('endDate', '>', today)
        .get();
      const offers = getFmtDocs(docsSnapshots)
        .filter(it => it.beginDate < today);
      console.log('fetchOffers', offers);
      dispatch(setOffers(offers));
    } catch (error) {
      console.warn('fetchOffers error', error);
      dispatch(addError(error.message));
    } finally {
      dispatch(setIsLoading(false));
      done();
    }
  },
});

const byId = createReducer({
  [setOffers]: (state: KeysOf<Offer>, offers: Offer[]) =>
    offers.reduce(reduceFnByID, {}),
}, {});

const allIds = createReducer({
  [setOffers]: (state: string[], offers: Offer[]) =>
    offers.map((it: Offer) => it.id),
}, []);

const rel = createReducer({
  [setOffers]: (state: Rel, offers: Offer[]) =>
    offers.reduce((acc, it) => (Object.assign(acc, {
      [it.productId]: (acc[it.productId] || []).concat(it.id),
    })), {}),
}, {});

const reducer = combineReducers({
  byId,
  allIds,
  rel,
});

export default reducer;

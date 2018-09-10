// @flow
import { combineReducers } from 'redux';
import { firestore } from 'firebase';
import type { DocumentSnapshot } from '@firebase/firestore-types';
import { createAction, createReducer } from 'redux-act';
import { createLogic } from 'redux-logic';

import type { Offer, KeysOf, NormalizdRel } from '../../common/types';
import { setIsLoading, addError } from '../global';
import { reduceFnByID, toDate } from '../../common/utils';
import { isTodayUserBirthday } from '../user/selectors';

export const fetchOffers = createAction('FETCH_OFFERS');
export const setOffers = createAction('SET_OFFERS');

export const fetchOffersLogic = createLogic({
  type: fetchOffers.getType(),
  process: async ({ db, getState }, dispatch, done) => {
    dispatch(setIsLoading(true));
    try {
      const today = firestore.Timestamp.now(); // new Date();
      console.log('fetchOffersLogic');
      const docsSnapshots = await db
        .collection('offers')
        .where('endDate', '>=', today)
        .get();
      const state = getState();
      const isUserBirthday = isTodayUserBirthday(state);
      const userGender = (state && state.user && state.user.gender) || 'all';
      const reducerFn = (acc: Offer[], it: DocumentSnapshot<Offer>) => {
        const offer = it.data();
        const valid: boolean = (offer.beginDate <= today) &&
          (!offer.isBirthday || (isUserBirthday && offer.isBirthday)) &&
          (offer.toGender === 'all' || offer.toGender === userGender);
        valid && acc.push({
          ...offer,
          id: it.id,
          beginDate: toDate(offer.beginDate),
          endDate: toDate(offer.endDate),
        });
        return acc;
      };
      const offers: Offer[] = docsSnapshots
        .docs
        .reduce(reducerFn, []);
      console.log('offers filtered', offers);
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

const byId = createReducer(
  {
    [setOffers]: (state: KeysOf<Offer>, offers: Offer[]) =>
      offers.reduce(reduceFnByID, {}),
  },
  {},
);

const allIds = createReducer(
  {
    [setOffers]: (state: string[], offers: Offer[]) =>
      offers.map((it: Offer) => it.id),
  },
  [],
);

const rel = createReducer(
  {
    [setOffers]: (state: NormalizdRel<Offer>, offers: Offer[]) =>
      offers.reduce(
        (acc, it) =>
          Object.assign(acc, {
            [it.productId]: (acc[it.productId] || []).concat(it.id),
          }),
        {},
      ),
  },
  {},
);

const reducer = combineReducers({
  byId,
  allIds,
  rel,
});

export default reducer;

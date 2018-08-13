// @flow
import { combineReducers } from 'redux';
import { createAction, createReducer } from 'redux-act';
import { createLogic } from 'redux-logic';

import type { Offer, KeysOf, NormalizdRel } from '../../common/types';
import { setIsLoading, addError } from '../global';
import { getFmtDocs, reduceFnByID } from '../../common/utils';
import { getUserGender, isTodayUserBirthday } from '../user/selectors';

export const fetchOffers = createAction(
  'FETCH_OFFERS',
  (force: boolean = false) => ({ force }),
);
export const setOffers = createAction('SET_OFFERS');

export const fetchOffersLogic = createLogic({
  type: fetchOffers.getType(),
  process: async ({ db, getState }, dispatch, done) => {
    dispatch(setIsLoading(true));
    try {
      const today = new Date();
      const docsSnapshots = await db
        .collection('offers')
        .where('endDate', '>=', today)
        .get();
      const state = getState();
      const isUserBirthday = isTodayUserBirthday(state);
      const userGender = state.user.gender;
      const offers: Offer[] = getFmtDocs(docsSnapshots)
        .filter(it => it.beginDate <= today)
        .filter(
          (it: Offer) => !it.isBirthday || (isUserBirthday && it.isBirthday),
        )
        .filter(
          (it: Offer) => it.toGender === 'all' || it.toGender === userGender,
        );
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

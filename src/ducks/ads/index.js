// @flow
import { createAction, createReducer } from 'redux-act';
import { createLogic } from 'redux-logic';

import type { Ad as AdType } from '../../config/types';
import { setIsLoading, addError } from '../global';
import { getDocs } from '../../utils';

export const fetchAds = createAction('FETCH_ADS', (force: boolean = false) => ({ force }));
export const setAds = createAction('SET_ADS');

export const fetchAdsLogic = createLogic({
  type: fetchAds.getType(),
  validate({ action }, allow, reject) {
    const { force } = action.payload;
    (force ? allow : reject)(action);
  },
  process: async ({ db }, dispatch, done) => {
    dispatch(setIsLoading(true));
    try {
      const docsSnapshots = await db.collection('ads').get();
      const ads = getDocs(docsSnapshots);
      dispatch(setAds(ads));
    } catch (error) {
      console.error('fetchAds', error);
      dispatch(addError(error));
    } finally {
      dispatch(setIsLoading(false));
      done();
    }
  },
});

const reducer = createReducer({
  // [fetchAds]: state => state,
  [setAds]: (state, ads: AdType[]) => ads,
}, []);

export default reducer;

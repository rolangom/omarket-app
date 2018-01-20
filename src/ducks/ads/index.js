// @flow
import { createAction, createReducer } from 'redux-act';
import { createLogic } from 'redux-logic';

import type { Ad as AdType } from '../../common/types';
import { setIsLoading, addError } from '../global';
import { getFmtDocs } from '../../common/utils';

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
      const ads = getFmtDocs(docsSnapshots);
      dispatch(setAds(ads));
    } catch (error) {
      console.warn('fetchAds error', error);
      dispatch(addError(error));
    } finally {
      dispatch(setIsLoading(false));
      done();
    }
  },
});

const reducer = createReducer({
  [setAds]: (state, ads: AdType[]) => ads,
}, []);

export default reducer;

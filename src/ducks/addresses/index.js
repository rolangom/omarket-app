// @flow
import { combineReducers } from 'redux';
import { createAction, createReducer } from 'redux-act';
import { createLogic } from 'redux-logic';

import type { Address, KeysOf } from '../../common/types';
import { setIsLoading, addError } from '../global';
import { deleteImmutable, getDocs, reduceFnByID, sortBy, uniqFilterFn } from '../../common/utils';

export const fetchAddresses = createAction('FETCH_ADDRESSES');
export const setAddresses = createAction('SET_ADDRESSES');
export const postAddress = createAction('POST_ADDRESS');
export const deleteAddress = createAction('DELETE_ADDRESS');

const byId = createReducer({
  [setAddresses]: (state: KeysOf<Address>, addresses: Address[]) => addresses.reduce(reduceFnByID, {}),
  [postAddress]: (state: KeysOf<Address>, address: Address) => ({ ...state, [address.id]: address }),
  [deleteAddress]: (state: KeysOf<Address>, addressID: string) => deleteImmutable(state, addressID),
}, {});

const allIds = createReducer({
  [setAddresses]: (state: string[], addresses: Address[]) => addresses.map((it: Address) => it.id),
  [postAddress]: (state: string[], address: Address) => state.concat(address.id).filter(uniqFilterFn),
  [deleteAddress]: (state: string[], addressID: string) => state.filter((id: string) => id !== addressID),
}, []);

export const fetchAddressesLogic = createLogic({
  type: fetchAddresses.getType(),
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
        .collection('addresses');
      const addresses = getDocs(docsSnapshots);
      dispatch(setAddresses(addresses));
    } catch (error) {
      console.warn('fetchAddressesLogic error', error);
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

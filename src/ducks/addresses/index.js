// @flow
import { combineReducers } from 'redux';
import { createAction, createReducer } from 'redux-act';
import { createLogic } from 'redux-logic';
import { NavigationActions } from 'react-navigation';

import type { Address, KeysOf } from '../../common/types';
import { setIsLoading, addError } from '../global';
import {
  deleteDoc,
  deleteImmutable, getFmtDocs, getRealtDocs, queryDoc, reduceFnByID, sortBy, uniqFilterFn,
  upsertDoc
} from '../../common/utils';

export const fetchAddresses = createAction('FETCH_ADDRESSES');
export const setAddresses = createAction('SET_ADDRESSES');
export const postAddress = createAction('POST_ADDRESS');
export const saveAddress = createAction('SAVE_ADDRESS');
export const requestDeleteAddress = createAction('REQ_DELETE_ADDRESS');
export const deleteAddress = createAction('DELETE_ADDRESS');

const byId = createReducer({
  [setAddresses]: (state: KeysOf<Address>, addresses: Address[]) => addresses.reduce(reduceFnByID, {}),
  [saveAddress]: (state: KeysOf<Address>, address: Address) => ({ ...state, [address.id]: address }),
  [deleteAddress]: (state: KeysOf<Address>, addressID: string) => deleteImmutable(state, addressID),
}, {});

const allIds = createReducer({
  [setAddresses]: (state: string[], addresses: Address[]) => addresses.map((it: Address) => it.id),
  [saveAddress]: (state: string[], address: Address) => state.concat(address.id).filter(uniqFilterFn),
  [deleteAddress]: (state: string[], addressID: string) => state.filter((id: string) => id !== addressID),
}, []);

export const fetchAddressesLogic = createLogic({
  type: fetchAddresses.getType(),
  validate({ getState, action }, allow, reject) {
    const { user } = getState();
    (user ? allow : reject)(action);
  },
  process: async ({ firebase, getState }, dispatch, done) => {
    try {
      dispatch(setIsLoading(true));
      const { user: { uid } } = getState();
      const docsSnapshots = await queryDoc(firebase, `users/${uid}/addresses`);
      const addresses = getRealtDocs(docsSnapshots);
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

export const postAddressLogic = createLogic({
  type: postAddress.getType(),
  process: async ({ firebase, action, getState }, dispatch, done) => {
    try {
      dispatch(setIsLoading(true));
      const { user: { uid } } = getState();
      const { id, ...data } = action.payload;
      const doc = await upsertDoc(firebase, `users/${uid}/addresses`, { key: id, ...data });
      const newAddress = {
        id: id || doc.key,
        ...data,
      };
      dispatch(saveAddress(newAddress));
      dispatch(NavigationActions.back());
    } catch (error) {
      console.warn('postAddressLogic error', error);
      dispatch(addError(error.message));
    } finally {
      dispatch(setIsLoading(false));
      done();
    }
  },
});

export const deleteAddressLogic = createLogic({
  type: requestDeleteAddress.getType(),
  process: async ({ getState, firebase, action }, dispatch, done) => {
    try {
      dispatch(setIsLoading(true));
      const { user: { uid } } = getState();
      const { payload: id } = action;
      await deleteDoc(firebase, `users/${uid}/addresses/${id}`);
      dispatch(deleteAddress(id));
      dispatch(NavigationActions.back());
    } catch (error) {
      console.warn('deleteAddressLogic error', error);
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

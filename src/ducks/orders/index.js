// @flow
import { combineReducers } from 'redux';
import { createAction, createReducer } from 'redux-act';
import { createLogic } from 'redux-logic';
import { NavigationActions } from 'react-navigation';

// import { postAddress } from '../addresses';
import type { OrderRequest, KeysOf } from '../../common/types';
import { setIsLoading, addError } from '../global';
import {
  deleteImmutable,
  getFmtDocs,
  reduceFnByID,
  uniqFilterFn,
  upsertDoc,
} from '../../common/utils';

export const fetchOrders = createAction('FETCH_ORDERS');
export const setOrders = createAction('SET_ORDERS');

const byId = createReducer(
  {
    [setOrders]: (state: KeysOf<OrderRequest>, orders: OrderRequest[]) =>
      orders.reduce(reduceFnByID, {}),
  },
  {},
);

const allIds = createReducer(
  {
    [setOrders]: (state: string[], orders: OrderRequest[]) =>
      orders.map((it: OrderRequest) => it.id),
  },
  [],
);


const reducer = combineReducers({
  byId,
  allIds,
});

export default reducer;

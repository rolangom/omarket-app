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

export const fetchOrdersLogic = createLogic({
  type: fetchOrders.getType(),
  validate({ getState, action }, allow, reject) {
    const { user } = getState();
    (user ? allow : reject)(action);
  },
  process: async ({ db, getState }, dispatch, done) => {
    try {
      dispatch(setIsLoading(true));
      const { user: { uid } } = getState();
      const docsSnapshots = await db
        .collection('orders')
        .where('uid', '==', uid)
        .get();
      const orders = getFmtDocs(docsSnapshots);
      dispatch(setOrders(orders));
    } catch (error) {
      console.warn('fetchOrdersLogic error', error);
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

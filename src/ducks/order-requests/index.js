// @flow
import { combineReducers } from 'redux';
import { createAction, createReducer } from 'redux-act';
import { createLogic } from 'redux-logic';
import { NavigationActions } from 'react-navigation';

import { postAddress } from '../addresses';
import type { OrderRequest, KeysOf } from '../../common/types';
import { setIsLoading, addError } from '../global';
import {
  deleteImmutable,
  getFmtDocs,
  reduceFnByID,
  uniqFilterFn,
  upsertDoc,
} from '../../common/utils';

export const fetchOrderRequests = createAction('FETCH_ORDER_REQUESTS');
export const setOrderRequests = createAction('SET_ORDER_REQUESTS');
export const postOrderRequest = createAction('POST_ORDER_REQUEST');
export const saveOrderRequest = createAction('SAVE_ORDER_REQUEST');
export const requestDeleteOrderRequest = createAction(
  'REQ_DELETE_ORDER_REQUEST',
);
export const deleteOrderRequest = createAction('DELETE_ORDER_REQUEST');

const byId = createReducer(
  {
    [setOrderRequests]: (
      state: KeysOf<OrderRequest>,
      orderRequests: OrderRequest[],
    ) => orderRequests.reduce(reduceFnByID, {}),
    [saveOrderRequest]: (
      state: KeysOf<OrderRequest>,
      orderRequest: OrderRequest,
    ) => ({ ...state, [orderRequest.id]: orderRequest }),
    [deleteOrderRequest]: (
      state: KeysOf<OrderRequest>,
      orderRequestID: string,
    ) => deleteImmutable(state, orderRequestID),
  },
  {},
);

const allIds = createReducer(
  {
    [setOrderRequests]: (state: string[], orderRequests: OrderRequest[]) =>
      orderRequests.map((it: OrderRequest) => it.id),
    [saveOrderRequest]: (state: string[], orderRequest: OrderRequest) =>
      state.concat(orderRequest.id).filter(uniqFilterFn),
    [deleteOrderRequest]: (state: string[], orderRequestID: string) =>
      state.filter((id: string) => id !== orderRequestID),
  },
  [],
);

export const fetchOrderRequestsLogic = createLogic({
  type: fetchOrderRequests.getType(),
  validate({ getState, action }, allow, reject) {
    const { user } = getState();
    (user ? allow : reject)(action);
  },
  process: async ({ db, getState }, dispatch, done) => {
    try {
      dispatch(setIsLoading(true));
      const { user: { uid } } = getState();
      const docsSnapshots = await db
        .collection('orderRequests')
        .where('uid', '==', uid)
        .get();
      const orderRequests = getFmtDocs(docsSnapshots);
      dispatch(setOrderRequests(orderRequests));
    } catch (error) {
      console.warn('fetchOrderRequestsLogic error', error);
      dispatch(addError(error.message));
    } finally {
      dispatch(setIsLoading(false));
      done();
    }
  },
});

export const postOrderRequestLogic = createLogic({
  type: postOrderRequest.getType(),
  transform({ action }, next) {
    const { payload } = action;
    console.log('postOrderRequestLogic transform', payload);
    next({
      ...action,
      payload: {
        ...payload,
        address:
          payload.addressID === '' || payload.addressID === undefined
            ? payload.address
            : undefined,
        creditCard:
          payload.creditCardID || payload.paymentMethod === 'cash'
            ? undefined
            : payload.creditCard.values,
        cashFor: payload.paymentMethod === 'cash' ? payload.cashFor : undefined,
      },
    });
  },
  process: async ({ db, action, getState }: { action: { payload: OrderRequest } }, dispatch, done) => {
    try {
      dispatch(setIsLoading(true));
      console.log('postOrderRequestLogic', action);
      const {
        doSaveAddress,
        addressID,
        address,
        paymentMethod,
        cashFor,
        creditCard,
        creditCardID,
      } = action.payload;
      const { cartItems: { byId: cartItemsById } } = getState();
      const items = Object.values(cartItemsById);
      console.log('items', items);

      // doSaveAddress && dispatch(postAddress(address));

      // const { user: { uid } } = getState();
      // const collection = db.collection('orderRequests');
      // const doc = await upsertDoc({ ...action.payload, uid }, collection);
      // const { id, ...data } = action.payload;
      // const newOrderRequest = {
      //   id: id || doc.id,
      //   ...data,
      // };
      // dispatch(saveOrderRequest(newOrderRequest));
      // dispatch(NavigationActions.back());

    } catch (error) {
      console.warn('postOrderRequestLogic error', error);
      dispatch(addError(error.message));
    } finally {
      dispatch(setIsLoading(false));
      done();
    }
  },
});

export const deleteOrderRequestLogic = createLogic({
  type: requestDeleteOrderRequest.getType(),
  process: async ({ getState, db, action }, dispatch, done) => {
    try {
      dispatch(setIsLoading(true));
      const { user: { uid } } = getState();
      const { payload: id } = action;
      // await db
      //   .collection('users')
      //   .doc(uid)
      //   .collection('orderRequests')
      //   .doc(id)
      //   .delete();
      dispatch(deleteOrderRequest(id));
      dispatch(NavigationActions.back());
    } catch (error) {
      console.warn('deleteOrderRequestLogic error', error);
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

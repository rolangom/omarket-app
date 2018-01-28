// @flow
import { combineReducers } from 'redux';
import { createAction, createReducer } from 'redux-act';
import { createLogic } from 'redux-logic';
import { NavigationActions } from 'react-navigation';

import { postAddress } from '../addresses';
import type { OrderRequest, KeysOf, State } from '../../common/types';
import { setIsLoading, addError } from '../global';
import {
  deleteImmutable,
  getFmtDocs,
  reduceFnByID,
  uniqFilterFn,
  upsertDoc,
} from '../../common/utils';
import { clearCartItems } from '../cart';

export const getSubtotal: number = (state: State, orderRequestID) =>
  state.orders.byId[orderRequestID].items.reduce(
    (acc, it) => acc + it.product.price,
    0,
  );

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
        .collection('orders')
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

type LogicActOrderRequest = { action: { payload: OrderRequest } };

export const postOrderRequestLogic = createLogic({
  type: postOrderRequest.getType(),
  transform({ action }, next) {
    const { payload } = action;
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
  process: async (
    { firebase, action, getState }: LogicActOrderRequest,
    dispatch,
    done,
  ) => {
    try {
      dispatch(setIsLoading(true));
      const { doSaveAddress } = action.payload;
      const { cartItems: { byId: cartItemsById }, user: { uid } } = getState();
      const items = Object.values(cartItemsById);
      const idToken = await firebase.auth().currentUser.getIdToken();
      await upsertDoc(firebase, `users/${uid}`, { key: 'cart', ...items });

      const resp = await fetch(
        'https://us-central1-shop-f518d.cloudfunctions.net/placeOrder',
        {
          // const resp = await fetch('http://localhost:5000/shop-f518d/us-central1/placeOrder', {
          method: 'POST',
          headers: {
            'id-token': idToken,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(action.payload),
        },
      );
      const jsonResp = await resp.json();
      console.log('postOrderRequestLogic jsonResp', jsonResp);
      const message =
        jsonResp.message || 'Ha ocurrido un error durante la transacción.';
      const isError = !resp.ok;
      !isError && dispatch(clearCartItems());
      !isError &&
        doSaveAddress &&
        dispatch(postAddress(action.payload.address, false));
      const defaultAction = NavigationActions.navigate({
        routeName: 'OrderRequestResult',
        params: {
          isError,
          message,
        },
      });
      const navActionSucc = NavigationActions.reset({
        index: 0,
        actions: [defaultAction],
      });
      dispatch(isError ? defaultAction : navActionSucc);
    } catch (error) {
      console.warn('postOrderRequestLogic error', error);
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

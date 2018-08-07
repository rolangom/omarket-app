// @flow
import { combineReducers } from 'redux';
import { createAction, createReducer } from 'redux-act';
import { createLogic } from 'redux-logic';
import { NavigationActions } from 'react-navigation';

import { postAddress } from '../addresses';
import type { OrderRequest, KeysOf, State, Rating } from '../../common/types';
import { setIsLoading, addError, setUsePoints } from '../global';
import { reduceFnByID, setImmutable, upsertDoc } from '../../common/utils';
import { clearCartItems } from '../cart';
import { getPoints } from '../user';

// export const getSubtotal: number = (state: State, orderRequestID) =>
//   state.orders.byId[orderRequestID].items.reduce(
//     (acc, it) => acc + it.product.price,
//     0,
//   );

export const setOrderRequests = createAction('SET_ORDER_REQUESTS');
export const postOrderRequest = createAction('POST_ORDER_REQUEST');
export const postOrderRequestRating = createAction(
  'POST_ORDER_REQ_RATING',
  (id: string, rating: Rating) => ({ id, rating }),
);

const byId = createReducer(
  {
    [setOrderRequests]: (
      state: KeysOf<OrderRequest>,
      orderRequests: OrderRequest[],
    ) => orderRequests.reduce(reduceFnByID, {}),
    [postOrderRequestRating]: (
      state: State,
      { id, rating }: { id: string, rating: Rating },
    ) => setImmutable(state, `${id}.rating`, rating),
  },
  {},
);

const allIds = createReducer(
  {
    [setOrderRequests]: (state: string[], orderRequests: OrderRequest[]) =>
      orderRequests.map((it: OrderRequest) => it.id),
  },
  [],
);

type LogicActOrderRequest = {
  action: { payload: OrderRequest },
  getState: () => State,
};

export const postOrderReqRatingLogic = createLogic({
  type: postOrderRequestRating.getType(),
  process: async ({ db, firebase, action }, dispatch, done) => {
    dispatch(setIsLoading(true));
    try {
      // const { id, rating } = action.payload;
      const idToken = await firebase.auth().currentUser.getIdToken();

      const resp = await fetch(
        'https://us-central1-shop-f518d.cloudfunctions.net/rateOrder',
        // 'http://localhost:5000/shop-f518d/us-central1/rateOrder',
        {
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
      // await db.collection('orders').doc(id).update({ rating });
    } catch (err) {
      console.warn('postOrderReqRatingLogic', err);
      dispatch(addError(err.message));
    } finally {
      dispatch(setIsLoading(false));
      done();
    }
  },
});

export const postOrderRequestLogic = createLogic({
  type: postOrderRequest.getType(),
  transform({ action, getState }, next) {
    const { payload } = action;
    const {
      user: { usesNCF },
      global: { isRushOrder, usePoints },
    } = getState();
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
        isRushOrder,
        usesNCF,
        usePoints,
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
        // 'http://localhost:5000/shop-f518d/us-central1/placeOrder',
        {
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
      dispatch(getPoints());
      const navActionSucc = NavigationActions.reset({
        index: 0,
        actions: [defaultAction],
      });
      dispatch(isError ? defaultAction : navActionSucc);
      dispatch(setUsePoints(false));
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

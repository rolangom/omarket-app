import { createAction, createReducer } from 'redux-act';
import { createLogic } from 'redux-logic';

import type { Message as MessageType } from '../../config/types';
import { fetchCategories } from '../categories';
import { fetchAds } from '../ads';
import { fetchProducts } from '../products';

export const setIsLoading = createAction('SET_IS_LOADING');
export const addMessage = createAction('ADD_MESSAGE', (type, title, text) => ({ type, title, text }));
export const deleteMessage = createAction('DELETE_MESSAGE');
export const initAppData = createAction('INIT_APP_DATA');

export const addError = text => addMessage('error', 'Error', text);

const reducer = createReducer({
  [setIsLoading]: (state, isLoading: boolean) => ({ ...state, isLoading }),
  [addMessage]:
    (state, message: MessageType) => ({ ...state, messages: state.messages.concat(message) }),
  [deleteMessage]: state => ({ ...state, messages: state.messages.slice(1) }),
}, {
  isLoading: false,
  messages: [],
});

export const initAppDataLogic = createLogic({
  type: initAppData.getType(),
  process(_, dispatch, done) {
    dispatch(fetchAds(true));
    dispatch(fetchCategories(true));
    dispatch(fetchProducts(true));
    done();
  },
});

export default reducer;

// @flow
import { createAction, createReducer } from 'redux-act';
import { createLogic } from 'redux-logic';

import type { Message as MessageType, Global } from '../../common/types';
import { fetchCategories } from '../categories';
import { fetchAds } from '../ads';
import { fetchProducts } from '../products';
import { getUser } from '../user';
import { fetchAddresses } from '../addresses';
import { fetchCreditcards } from '../credit-cards';

export const setIsLoading = createAction('SET_IS_LOADING');
export const addMessage = createAction('ADD_MESSAGE', (type, title, text) => ({
  type,
  title,
  text,
}));
export const deleteMessage = createAction('DELETE_MESSAGE');
export const initAppData = createAction('INIT_APP_DATA');

export const fetchConfigs = createAction('FECTH_CONFIGS');
export const setConfigs = createAction('SET_CONFIGS');
export const setFilters = createAction('SET_FILTERS', (key, value) => ({
  key,
  value,
}));
export const setFiltersAsUseful = createAction('SET_FILTERS_UTIL');
// export const setSearchTerm = createAction('SET_SEARCH_TERM');

export const addError = text => addMessage('error', 'Error', text);
export const addRawError = error => addMessage('error', 'Error', error.message);

type KeyValue = {
  key: string,
  value: any,
};

type Filter = {
  utilities: ?string,
  contents: ?string,
};

const reducer = createReducer(
  {
    [setIsLoading]: (state: Global, isLoading: boolean) => ({
      ...state,
      isLoading,
    }),
    [addMessage]: (state: Global, message: MessageType) => ({
      ...state,
      messages: state.messages.concat(message),
    }),
    [deleteMessage]: (state: Global) => ({
      ...state,
      messages: state.messages.slice(1),
    }),
    [setConfigs]: (state: Global, { utilities, contents }: Global) => ({
      ...state,
      utilities,
      contents,
    }),
    [setFiltersAsUseful]: (state: Global, value: ?string) => ({
      ...state,
      filters: { ...state.filters, utilities: value },
    }),
    [setFilters]: (state: Global, { key, value }: KeyValue) => ({
      ...state,
      filters: { ...state.filters, [key]: value },
    }),
  },
  {
    isLoading: false,
    messages: [],
    utilities: [],
    contents: [],
    filters: {
      searchTerm: '',
      utilities: null,
      contents: null,
    },
  },
);

export const fetchConfigsLogic = createLogic({
  type: fetchConfigs.getType(),
  process: async ({ db }, dispatch, done) => {
    try {
      dispatch(setIsLoading(true));
      const docSnapshots = await db.collection('config').get();
      const configs = docSnapshots.docs.reduce((acc, it) => ({
        ...acc,
        [it.id]: it.data(),
      }));
      dispatch(
        setConfigs({
          utilities: configs.utilities.value.split(';'),
          contents: configs.contents.value.split(';'),
        }),
      );
    } catch (err) {
      console.warn('fetchConfigsLogic', err);
      dispatch(addError(err.message));
    } finally {
      dispatch(setIsLoading(false));
      done();
    }
  },
});

export const searchTermLogic = createLogic({
  type: setFilters.getType(),
  // throttle: 750,
  debounce: 750,
});

export const initAppDataLogic = createLogic({
  type: initAppData.getType(),
  process(_, dispatch, done) {
    dispatch(fetchAds(true));
    dispatch(fetchCategories(true));
    dispatch(fetchProducts(true));
    dispatch(fetchConfigs());
    dispatch(getUser());
    dispatch(fetchAddresses());
    dispatch(fetchCreditcards());
    done();
  },
});

export default reducer;

// @flow
import { createAction, createReducer } from 'redux-act';
import { createLogic } from 'redux-logic';

import type {
  Message as MessageType,
  Global,
  CartItem,
  ConfirmConfig,
} from '../../common/types';
import { fetchCategories } from '../categories';
import { fetchAds } from '../ads';
import { getUser } from '../user';
import { fetchAddresses } from '../addresses';
import { fetchCreditcards } from '../credit-cards';
import { fetchOffers } from '../offers';
import { postCartProduct } from '../cart';
import { multiDispatch } from '../../common/utils';

// export const setIsLoading = createAction('SET_IS_LOADING');
export const addMessage = createAction('ADD_MESSAGE', (type, title, text) => ({
  type,
  title,
  text,
}));
export const deleteMessage = createAction('DELETE_MESSAGE');
export const initAppData = createAction('INIT_APP_DATA');

export const fetchConfigs = createAction('FETCH_CONFIGS');
export const setConfigs = createAction('SET_CONFIGS');
export const setConfig = createAction('SET_CONFIG');
export const setFilters = createAction('SET_FILTERS', (key, value) => ({
  key,
  value,
}));
export const setFiltersAsUseful = createAction('SET_FILTERS_UTIL');
// export const setConfirmModalConfig = createAction('SET_CONFIRM_MODAL_CFG');
// export const setReserveConfirmVisible = createAction('RESERVE_CONFIRM_VISIBLE');
// export const setSearchTerm = createAction('SET_SEARCH_TERM');

export const addError = text => addMessage('error', 'Error', text);
export const addInfo = text => addMessage('info', 'Info', text);
export const addRawError = error => addMessage('error', 'Error', error.message);

const getEmptyConfirmObj = (visible: boolean): ConfirmConfig => ({
  visible,
  title: 'Confirmar',
  message: '¿Está seguro que desea realizar la acción solicitada?',
  acceptButtonText: 'OK',
  acceptActionType: '',
  acceptPayload: undefined,
  cancelButtonText: 'Cancelar',
  cancelActionType: '',
});

const setConfirmModalConfig = (config: ConfirmConfig) =>
  setConfig({ key: 'confirmModal', value: config });

export const hideConfirm = (config: ConfirmConfig) => setConfirmModalConfig({
  ...getEmptyConfirmObj(false),
  ...config,
});

export const showConfirm = (config: ConfirmConfig) => setConfirmModalConfig({
  ...getEmptyConfirmObj(true),
  ...config,
});

export const setIsLoading = (isLoading: boolean) =>
  setConfig({ key: 'isLoading', value: isLoading });

export const setReserveConfirmVisible = (visible: boolean) =>
  setConfig({ key: 'reserveModalVisible', value: visible });

export const setIsRushService = (isRush: boolean) =>
  setConfig({ key: 'isRushOrder', value: isRush });

export const setUsePoints = (usePoints: boolean) =>
  setConfig({ key: 'usePoints', value: usePoints });

export const setShowRelatedProdId = (prodId: ?string) =>
  setConfig({ key: 'showRelatedProdId', value: prodId });

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
    [addMessage]: (state: Global, message: MessageType) => ({
      ...state,
      messages: state.messages.concat(message),
    }),
    [deleteMessage]: (state: Global) => ({
      ...state,
      messages: state.messages.slice(1),
    }),
    [setConfigs]: (state: Global, { utilities, contents, itbis, currency, rushPrice }: Global) => ({
      ...state,
      rushPrice,
      itbis,
      currency,
      utilities,
      contents,
    }),
    [setConfig]: (state: Global, { key, value }: KeyValue) => ({
      ...state,
      [key]: value,
    }),
    [setFiltersAsUseful]: (state: Global, value: ?string) => ({
      ...state,
      filters: { ...state.filters, utilities: value },
    }),
    [setFilters]: (state: Global, { key, value }: KeyValue) => ({
      ...state,
      filters: { ...state.filters, [key]: value },
    }),
    [postCartProduct]: (state: Global, item: CartItem) => ({
      ...state,
      lastProdIdAdded: item.productID,
    }),
  },
  {
    isLoading: false,
    messages: [],
    utilities: [],
    contents: [],
    lastProdIdAdded: null,
    currency: 'RD$',
    itbis: 0.18,
    rushPrice: 350,
    isRushOrder: false,
    filters: {
      searchTerm: '',
      utilities: null,
      contents: null,
    },
    usePoints: false,
    reserveModalVisible: false,
    confirmModal: getEmptyConfirmObj(false),
    showRelatedProdId: null,
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
      }), {});
      dispatch(
        setConfigs({
          itbis: configs.itbis.value,
          currency: configs.currency.value,
          rushPrice: configs.rushPrice.value,
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
  latest: true,
});

export const initAppDataLogic = createLogic({
  type: initAppData.getType(),
  process(_, dispatch, done) {
    multiDispatch(
      dispatch,
      fetchAds(true),
      fetchCategories(true),
      fetchConfigs(),
      getUser(),
    );
    done();
  },
});

export default reducer;

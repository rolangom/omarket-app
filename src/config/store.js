// @flow
import { createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import { createLogicMiddleware } from 'redux-logic';
import { persistStore, persistCombineReducers } from 'redux-persist';
import storage from 'redux-persist/es/storage';

import reducers from './reducers';
import logics from './logics';

import firebase, { db } from './fbase';

const originalSend = XMLHttpRequest.prototype.send;
XMLHttpRequest.prototype.send = function(body) {
  if (body === '') {
    originalSend.call(this);
  } else {
    originalSend.call(this, body);
  }
};

const configureStore = () => {
  const config = {
    key: 'root',
    blacklist: ['nav'],
    storage,
  };

  const reducer = persistCombineReducers(config, reducers);

  const store = createStore(
    reducer,
    applyMiddleware(
      logger,
      createLogicMiddleware(logics, { firebase, db }),
    ),
  );
  const persistor = persistStore(store);
  return { store, persistor };
};

export default configureStore;

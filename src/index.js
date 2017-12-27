import React from 'react';
import { Provider } from 'react-redux';
import { StyleProvider } from 'native-base';
import { PersistGate } from 'redux-persist/es/integration/react';

import LoadingModal from './common/components/loading-modal';
import getTheme from '../native-base-theme/components';
import commonColor from '../native-base-theme/variables/commonColor';

import configureStore from './config/store';
import initApp from './config/app';
import App from './app';

const { persistor, store } = configureStore();

class Root extends React.Component {
  componentDidMount() {
    this.unsubscr = initApp(store);
  }
  componentWillUnmount() {
    this.unsubscr();
  }
  unsubscr;
  style = getTheme(commonColor);
  render() {
    return (
      <Provider store={store}>
        <PersistGate
          persistor={persistor}
          loading={<LoadingModal isLoading />}
        >
          <StyleProvider style={this.style}>
            <App />
          </StyleProvider>
        </PersistGate>
      </Provider>
    );
  }
}

export default Root;

import React from 'react';
import { Provider } from 'react-redux';
import { View } from 'react-native';
import { StyleProvider } from 'native-base';

import getTheme from '../native-base-theme/components';
import commonColor from '../native-base-theme/variables/commonColor';

import LoadingModal from './common/components/loading-modal';
import Messages from './common/components/messages';

import AppWithNavigationState from './navigators/app-with-navigation-state';
import configureStore from './config/store';
import { initAppData } from './ducks/global';

const styles = {
  main: {
    flex: 1,
  },
};

class Root extends React.Component {
  componentDidMount() {
    this.store.dispatch(initAppData());
  }
  store = configureStore();
  style = getTheme(commonColor);
  render() {
    return (
      <Provider store={this.store}>
        <StyleProvider style={this.style}>
          <View style={styles.main}>
            <AppWithNavigationState />
            <Messages />
            <LoadingModal />
          </View>
        </StyleProvider>
      </Provider>
    );
  }
}

export default Root;

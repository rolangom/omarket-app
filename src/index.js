import React from 'react';
import { Provider } from 'react-redux';
import { View } from 'react-native';
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
  render() {
    return (
      <Provider store={this.store}>
        <View style={styles.main}>
          <AppWithNavigationState />
          <Messages />
          <LoadingModal />
        </View>
      </Provider>
    );
  }
}

export default Root;

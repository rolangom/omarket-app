import React from 'react';
import { View } from 'react-native';

import LoadingModal from './common/components/loading-modal';
import ConfirmModal from './common/components/ConfirmModal';
import ConfirmReserveModal from './screens/cart/components/ConfirmReserveModal';
import Messages from './common/components/messages';

import AppWithNavigationState from './navigators/app-with-navigation-state';

const styles = {
  main: {
    flex: 1,
  },
};

const App = () => (
  <View style={styles.main}>
    <AppWithNavigationState />
    <Messages />
    <ConfirmReserveModal />
    <LoadingModal />
  </View>
);

export default App;

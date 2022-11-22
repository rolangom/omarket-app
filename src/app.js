import React from 'react';
import { View } from 'react-native';

import LoadingModal from './common/components/loading-modal';
import ConfirmModal from './common/components/ConfirmModal';
import ConfirmReserveModal from './screens/cart/components/ConfirmReserveModal';
import Messages from './common/components/messages';
import RelatedProductsDialog from './common/components/RelatedProductsDialog';
import { flex1 } from './common/utils/styles';

import AppWithNavigationState from './navigators/app-with-navigation-state';

const App = () => (
  <View style={flex1}>
    <AppWithNavigationState />
    <Messages />
    <ConfirmModal />
    <ConfirmReserveModal />
    <LoadingModal />
    <RelatedProductsDialog />
  </View>
);

export default App;

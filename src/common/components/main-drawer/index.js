
import React from 'react';
import { StatusBar, Platform, ScrollView } from 'react-native';
import { DrawerItems, SafeAreaView } from 'react-navigation';

const styles = {
  container: {
    paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
    flex: 1,
  },
};

const MainDrawer = (props) => (
  <ScrollView>
    <SafeAreaView style={styles.container} forceInset={{ top: 'always', horizontal: 'never' }}>
      <DrawerItems {...props} />
    </SafeAreaView>
  </ScrollView>
);

export default MainDrawer;

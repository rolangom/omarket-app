// @flow
import React from 'react';
import { StackNavigator } from 'react-navigation';
import { Platform, StatusBar } from 'react-native';

import SettingsScreen from '../screens/settings';
import HomeScreen from '../screens/home';

import HeaderTitle from '../common/components/header-title';
import IconButtonCart from '../common/components/icon-button-cart';

const AppNavigator = StackNavigator(
  {
    Home: { screen: HomeScreen },
    Settings: { screen: SettingsScreen },
  },
  {
    // initialRouteName: 'Home',
    cardStyle: {
      paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
    },
    navigationOptions: ({ navigation }) => ({
      headerTitle: HeaderTitle,
      headerStyle: { backgroundColor: 'white' },
      headerRight: <IconButtonCart onNavigate={() => navigation.navigate('Settings')} />,
    }),
  },
);

export default AppNavigator;

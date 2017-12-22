// @flow
import React from 'react';
import { StackNavigator } from 'react-navigation';
import { Platform, StatusBar } from 'react-native';

import SettingsScreen from '../screens/settings';
import HomeScreen from '../screens/home';
import ProductDetailScreen from '../screens/product-detail';
import CartScreen from '../screens/cart';

import HeaderTitle from '../common/components/header-title';
import IconButtonCart from '../common/components/icon-button-cart';
import { darkGray } from '../config/constants';

const AppNavigator = StackNavigator(
  {
    Home: { screen: HomeScreen },
    ProductDetail: { screen: ProductDetailScreen },
    Cart: { screen: CartScreen },
    Settings: { screen: SettingsScreen },
  },
  {
    // initialRouteName: 'Home',
    cardStyle: {
      paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
    },
    navigationOptions: ({ navigation }) => ({
      headerTitle: HeaderTitle,
      headerTintColor: darkGray,
      headerStyle: { backgroundColor: 'white' },
      headerRight: <IconButtonCart onNavigate={() => navigation.navigate('Cart')} />,
    }),
  },
);

export default AppNavigator;

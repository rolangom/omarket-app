// @flow
import React from 'react';
import { StackNavigator, DrawerNavigator } from 'react-navigation';
import { Platform, StatusBar } from 'react-native';
import { Icon } from 'native-base';

import SettingsScreen from '../screens/settings';
import HomeScreen from '../screens/home';
import ProfileScreen from '../screens/profile';
import ProductDetailScreen from '../screens/product-detail';
import CartScreen from '../screens/cart';
import AddressListScreen from '../screens/addresses';

import HeaderTitle from '../common/components/header-title';
import IconButtonCart from '../common/components/icon-button-cart';
import HambMenuIcon from '../common/components/hamb-menu-icon';
import { darkGray, red } from '../common/utils/constants';
import MainDrawer from '../common/components/main-drawer';

const defaultNavigationOptions = (shouldNavigateCart = true) => ({
  headerTitle: HeaderTitle,
  headerTintColor: darkGray,
  headerStyle: { backgroundColor: 'white' },
  headerRight: <IconButtonCart destRoute="Cart" shouldNavigate={shouldNavigateCart} />,
});

const getCardStyle = () => ({
  paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
});

const getStackScreen = (routeName: string, screen, drawerLabel: string, iconName: string, shouldNavigateCart: boolean) => ({
  screen: StackNavigator({
    [routeName]: {
      screen,
      navigationOptions: ({ navigation }) => ({
        ...defaultNavigationOptions(shouldNavigateCart),
        headerLeft: <HambMenuIcon onPress={() => navigation.navigate('DrawerOpen')} />,
        drawerLabel,
        drawerIcon: ({ tintColor }) => (
          <Icon
            name={iconName}
            style={{ color: tintColor }}
          />
        ),
      }),
    },
  }, {
    cardStyle: getCardStyle(),
  }),
});

const BrowseStack = StackNavigator({
  Start: {
    screen: HomeScreen,
    navigationOptions: ({ navigation }) => ({
      headerLeft: <HambMenuIcon onPress={() => navigation.navigate('DrawerOpen')} />,
    }),
  },
  Browse: { screen: HomeScreen },
  ProductDetail: { screen: ProductDetailScreen },
}, {
  cardStyle: getCardStyle(),
  navigationOptions: defaultNavigationOptions(true),
});

const AppNavigator = DrawerNavigator({
  Start: {
    screen: BrowseStack,
    navigationOptions: {
      drawerLabel: 'Inicio',
      drawerIcon: ({ tintColor }) => (
        <Icon
          name="ios-home"
          style={{ color: tintColor }}
        />
      ),
    },
  },
  Profile: getStackScreen('Profile', ProfileScreen, 'Perfil', 'ios-contact', true),
  Cart: getStackScreen('Cart', CartScreen, 'Carrito', 'ios-cart', false),
  Settings: getStackScreen('Settings', SettingsScreen, 'Configuración', 'ios-cog', true),
  Addresses: getStackScreen('Addresses', AddressListScreen, 'Direcciones', 'ios-locate', true),
}, {
  contentComponent: MainDrawer,
  contentOptions: {
    activeTintColor: red,
    inactiveTintColor: darkGray,
  },
});


export default AppNavigator;

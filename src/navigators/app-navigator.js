// @flow
import React from 'react';
import { createStackNavigator, createDrawerNavigator } from 'react-navigation';
import { Platform, StatusBar } from 'react-native';
import { Icon } from 'native-base';

import SettingsScreen from '../screens/settings';
import HomeScreen from '../screens/home';
import SearchScreen from '../screens/home/search';
import ProfileScreen from '../screens/profile';
import ProductDetailScreen from '../screens/product-detail';
import CartScreen from '../screens/cart';
import AddressListScreen from '../screens/address/list';
import AddressEditorScreen from '../screens/address/editor';
import CreditCardListScreen from '../screens/credit-card/list';
import CreditCardEditorScreen from '../screens/credit-card/editor';
import OrderRequestEditorScreen from '../screens/order-request/editor';
import OrderRequestResultScreen from '../screens/order-request/result';
import OrderRequestDetailScreen from '../screens/order-request/detail';
import OrderListScreen from '../screens/orders/list';
import SavedCartListScreen from '../screens/savedCarts/list';
import SavedCartDetailScreen from '../screens/savedCarts/detail';

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

const BrowseStack = createStackNavigator({
  Start: {
    screen: HomeScreen,
    navigationOptions: ({ navigation }) => ({
      headerLeft: <HambMenuIcon onPress={navigation.openDrawer} />,
    }),
  },
  Browse: { screen: HomeScreen },
  ProductDetail: { screen: ProductDetailScreen },
  Search: { screen: SearchScreen },
}, {
  navigationOptions: defaultNavigationOptions(true),
});


const AddressesStack = createStackNavigator({
  Addresses: {
    screen: AddressListScreen,
    navigationOptions: ({ navigation }) => ({
      headerLeft: <HambMenuIcon onPress={navigation.openDrawer} />,
    }),
  },
  AddressEditor: { screen: AddressEditorScreen },
}, {
  navigationOptions: defaultNavigationOptions(true),
});

const CreditCardStack = createStackNavigator({
  Creditcards: {
    screen: CreditCardListScreen,
    navigationOptions: ({ navigation }) => ({
      headerLeft: <HambMenuIcon onPress={navigation.openDrawer} />,
    }),
  },
  CreditcardEditor: { screen: CreditCardEditorScreen },
}, {
  navigationOptions: defaultNavigationOptions(true),
});

const OrdersStack = createStackNavigator({
  Orders: {
    screen: OrderListScreen,
    navigationOptions: ({ navigation }) => ({
      headerLeft: <HambMenuIcon onPress={navigation.openDrawer} />,
    }),
  },
  OrdersRequestDetail: { screen: OrderRequestDetailScreen },
}, {
  navigationOptions: defaultNavigationOptions(true),
});

const CartStack = createStackNavigator({
  Cart: {
    screen: CartScreen,
    navigationOptions: ({ navigation }) => ({
      headerLeft: <HambMenuIcon onPress={navigation.openDrawer} />,
    }),
  },
  OrderRequest: { screen: OrderRequestEditorScreen },
  OrderRequestResult: { screen: OrderRequestResultScreen },
}, {
  navigationOptions: defaultNavigationOptions(false),
});

// SavedCartListScreen
const SavedCartStack = createStackNavigator({
  SavedCartList: {
    screen: SavedCartListScreen,
    navigationOptions: ({ navigation }) => ({
      headerLeft: <HambMenuIcon onPress={navigation.openDrawer} />,
    }),
  },
  SavedCartDetail: { screen: SavedCartDetailScreen },
}, {
  navigationOptions: defaultNavigationOptions(true),
});

const ProfileStack = createStackNavigator({
  Profile: {
    screen: ProfileScreen,
    navigationOptions: ({ navigation }) => ({
      headerLeft: <HambMenuIcon onPress={navigation.openDrawer} />,
    }),
  },
}, {
  navigationOptions: defaultNavigationOptions(true),
});

const AppNavigator = createDrawerNavigator({
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
  // Profile: getStackScreen('Profile', ProfileScreen, 'Perfil', 'md-contact', true),
  Profile: {
    screen: ProfileStack,
    navigationOptions: {
      drawerLabel: 'Perfil',
      drawerIcon: ({ tintColor }) => (
        <Icon
          name="ios-contact"
          style={{ color: tintColor }}
        />
      ),
    },
  },
  // Settings: getStackScreen('Settings', SettingsScreen, 'Configuración', 'ios-cog', true),
  Cart: {
    screen: CartStack,
    navigationOptions: {
      drawerLabel: 'Carrito',
      drawerIcon: ({ tintColor }) => (
        <Icon
          name="ios-cart"
          style={{ color: tintColor }}
        />
      ),
    },
  },
  Addresses: {
    screen: AddressesStack,
    navigationOptions: {
      drawerLabel: 'Direcciones',
      drawerIcon: ({ tintColor }) => (
        <Icon
          name="ios-locate"
          style={{ color: tintColor }}
        />
      ),
    },
  },
  Creditcards: {
    screen: CreditCardStack,
    navigationOptions: {
      drawerLabel: 'Tarjetas',
      drawerIcon: ({ tintColor }) => (
        <Icon
          name="ios-card"
          style={{ color: tintColor }}
        />
      ),
    },
  },
  Orders: {
    screen: OrdersStack,
    navigationOptions: {
      drawerLabel: 'Órdenes',
      drawerIcon: ({ tintColor }) => (
        <Icon
          name="md-list-box"
          style={{ color: tintColor }}
        />
      ),
    },
  },
  SavedCart: {
    screen: SavedCartStack,
    navigationOptions: {
      drawerLabel: 'Listas guardadas',
      drawerIcon: ({ tintColor }) => (
        <Icon
          name="ios-archive"
          style={{ color: tintColor }}
        />
      ),
    },
  },
}, {
  contentComponent: MainDrawer,
  contentOptions: {
    activeTintColor: red,
    inactiveTintColor: darkGray,
  },
});


export default AppNavigator;

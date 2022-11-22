import React from 'react';
import { AppLoading, Font } from 'expo';
// import { useScreens } from 'react-native-screens';
// import 'babel-polyfill';
import Root from './src';

// useScreens();

export default class App extends React.Component {
  state = {
    isReady: false,
  };
  async cacheResourcesAsync() {
    const promise = Font.loadAsync({
      'Roboto_medium': require('./assets/fonts/Roboto-Medium.ttf'),
      'Roboto_regular': require('./assets/fonts/Roboto-Regular.ttf'),
      'Roboto_light': require('./assets/fonts/Roboto-Light.ttf'),
    });
    return promise;
  }
  setReady = () => this.setState({ isReady: true });
  render() {
    if (!this.state.isReady) {
      return (
        <AppLoading
          startAsync={this.cacheResourcesAsync}
          onFinish={this.setReady}
          onError={console.warn}
        />
      );
    }
    return (
      <Root />
    );
  }
}

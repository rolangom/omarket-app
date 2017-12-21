import React from 'react';
// import { StyleSheet, Text, View } from 'react-native';
import { AppLoading, Font } from 'expo';
import Root from './src';

export default class App extends React.Component {
  state = {
    isReady: false,
  };

  async cacheResourcesAsync() {
    const promise = Font.loadAsync({
      'Roboto_medium': require('./assets/fonts/Roboto-Medium.ttf'),
    });
    return Promise.all([promise]);
  }

  render() {
    if (!this.state.isReady) {
      return (
        <AppLoading
          startAsync={this.cacheResourcesAsync}
          onFinish={() => this.setState({ isReady: true })}
          onError={console.warn}
        />
      );
    }

    return (
      <Root />
    );
  }
}

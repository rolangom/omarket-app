import React from 'react';
import { AppLoading, Font } from 'expo';
import Root from './src';

export default class App extends React.Component {
  state = {
    isReady: false,
  };

  async cacheResourcesAsync() {
    const promise = Font.loadAsync({
      'Roboto_regular': require('./assets/fonts/Roboto-Regular.ttf'),
      'Roboto_light': require('./assets/fonts/Roboto-Light.ttf'),
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

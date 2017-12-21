import React from 'react';
import { BackHandler } from 'react-native';
import { connect } from 'react-redux';
import {
  addNavigationHelpers,
  NavigationActions,
} from 'react-navigation';
import AppNavigator from './app-navigator';

type Props = {
  dispatch: () => void,
  nav: any,
};

class AppWithNavigationState extends React.Component<Props> {
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
  }
  onBackPress = () => {
    const { dispatch, nav } = this.props;
    if (nav.index === 0) {
      return false;
    }
    dispatch(NavigationActions.back());
    return true;
  };

  render() {
    const { dispatch, nav } = this.props;
    const navigation = addNavigationHelpers({
      dispatch,
      state: nav,
    });

    return <AppNavigator navigation={navigation} />;
  }
}

const mapStateToProps = state => ({ nav: state.nav });

export default connect(mapStateToProps)(AppWithNavigationState);

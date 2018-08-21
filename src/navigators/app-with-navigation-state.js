import React from 'react';
import { connect } from 'react-redux';
import { BackHandler } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { AppNavigator } from '.';

type Props = {
  dispatch: () => void,
  state: Object,
};

class AppWithNavigationState extends React.Component<Props> {
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
  }
  onBackPress = () => {
    const { dispatch, state } = this.props;
    if (state.index === 0) {
      return false;
    }
    dispatch(NavigationActions.back());
    return true;
  };

  render() {
    return (
      <AppNavigator
        state={this.props.state}
        dispatch={this.props.dispatch}
      />
    );
  }
}

const mapStateToProps = state => ({
  state: state.nav,
});
export default connect(mapStateToProps)(AppWithNavigationState);

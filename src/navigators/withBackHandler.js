// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { AndroidBackHandler } from 'react-navigation-backhandler';

import { NavigationActions, DrawerActions } from 'react-navigation';
import type { State } from 'src/common/types';

type Props = {
  dispatch: Dispatch,
  state: Object,
};

const withBackHandler = (WrappedComponent: React.Node<*>) => {
  return class BackHandler extends React.Component<Props> {
    _isDrawerOpen = nav => nav.routes[0].index === 1;
    _shouldCloseApp = nav => {
      if (nav.index > 0) return false;
      if (nav.routes) {
        return nav.routes.every(this._shouldCloseApp);
      }
      return true;
    };
    _goBack = () => this.props.dispatch(NavigationActions.back());
    _closeDrawer = () => this.props.dispatch(DrawerActions.closeDrawer());
    onBackPressed = () => {
      const { state } = this.props;
      if (this._isDrawerOpen(state)) {
        this._closeDrawer();
        return true;
      }
      if (this._shouldCloseApp(state)) {
        return false;
      }
      this._goBack();
      return true;
    };
    render() {
      const { ...props } = this.props;
      return (
        <AndroidBackHandler onBackPress={this.onBackPressed}>
          <WrappedComponent {...props} />
        </AndroidBackHandler>
      );
    }
  };
};

const mapStateToProps = (state: State) => ({
  state: state.nav,
});
export default compose(
  connect(mapStateToProps),
  withBackHandler,
);

// export default connect(mapStateToProps)(BackHandler);


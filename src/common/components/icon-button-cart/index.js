// @flow
import React from 'react';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import {
  Button,
  Icon,
  View,
  Badge,
  Text,
} from 'native-base';
import { darkGray } from '../../utils/constants';
import type { State } from '../../types';
import { getCartItemsQty } from '../../../ducks/cart/selectors';

export type Props = {
  onNavigate: () => void,
  qty: number,
  destRoute?: string,
  isLocal: boolean,
  shouldNavigate: boolean,
};

const styles = {
  badge: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  icon: {
    color: darkGray,
  },
};

const IconButtonCart = ({ onNavigate, qty, isLocal }: Props) => (
  <View>
    {qty > 0 &&
      <Badge
        primary
        style={styles.badge}
      >
        <Text>{qty}</Text>
      </Badge>
    }
    <Button
      transparent
      onPress={onNavigate}
    >
      <Icon
        name={isLocal ? 'ios-cart' : 'ios-cart-outline'}
        style={styles.icon}
      />
    </Button>
  </View>
);

IconButtonCart.defaultProps = {
  destRoute: 'Cart',
  shouldNavigate: true,
};

const mapStateToProps = (state: State) => ({
  qty: getCartItemsQty(state),
  routeName: state.nav.routes[state.nav.index].routeName,
});

const mapDispatchToProps = (dispatch, { destRoute }) => ({
  onNavigate: () => dispatch(NavigationActions.navigate({ routeName: destRoute })),
});

const mergeStateDispatchToProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  isLocal: stateProps.routeName === ownProps.destRoute,
  onNavigate: ownProps.shouldNavigate ? dispatchProps.onNavigate : (() => {}),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeStateDispatchToProps,
)(IconButtonCart);

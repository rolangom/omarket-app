// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { ConfirmDialog } from 'react-native-simple-dialogs';
import type { Cart, State } from 'src/common/types';
import {
  clearCartItems,
  reserveCartProducts,
  setCartProducts,
} from 'src/ducks/cart';
import { requestDeleteCart } from 'src/ducks/savedCarts';
import { setReserveConfirmVisible } from 'src/ducks/global';
import { multiDispatch } from 'src/common/utils';

type ExtraProps = {
  savedCarts: Cart[],
  areItemsOnCart: boolean,
};

type Props = ExtraProps & {
  visible: boolean,
  onAccept: () => void,
  onCancel: () => void,
};

const message =
  'Los productos agregados se mantienen por 5 minutos posterior al último cambio.\n' +
  'Para mantener o aplicar el último listado, favor presonar "OK"';

const ConfirmReserveModal = ({ visible, onAccept, onCancel }: Props) => (
  <ConfirmDialog
    title="Reserva"
    message={message}
    visible={visible}
    positiveButton={{
      title: 'OK',
      onPress: onAccept,
    }}
    negativeButton={{
      title: 'Cancelar',
      onPress: onCancel,
    }}
  />
);

const getCartByTime = (savedCarts: Cart[], time) =>
  savedCarts.find(it => it.createdAt === time) || { content: {} };

const getReapplyCartAction = (savedCart: Cart[]) => {
  const maxTime = Math.max(...savedCart.map(it => it.createdAt));
  const cart = getCartByTime(savedCart, maxTime);
  return Number.isFinite(maxTime) && cart
    ? [setCartProducts(cart.content), requestDeleteCart(cart.id, false)]
    : undefined;
};

const mapStateToProps = (state: State): ExtraProps => ({
  savedCarts: Object.values(state.savedCarts.byId),
  areItemsOnCart: state.cartItems.allIds.length > 0,
  visible: state.global.reserveModalVisible,
});
const mapDispatchToProps = dispatch => ({
  onCancel: () => {
    dispatch(setReserveConfirmVisible(false));
    dispatch(clearCartItems());
    dispatch(reserveCartProducts({ noPreAlert: true }));
  },
  onAcceptAction: (savedCarts: Cart[], areItemsOnCart: boolean) => {
    dispatch(setReserveConfirmVisible(false));
    const actions = areItemsOnCart
      ? undefined
      : getReapplyCartAction(savedCarts);
    actions && multiDispatch(dispatch, ...actions);
    dispatch(reserveCartProducts());
  },
});

const mergeProps = (stateProps: ExtraProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  onAccept: () =>
    dispatchProps.onAcceptAction(
      stateProps.savedCarts,
      stateProps.areItemsOnCart,
    ),
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(
  ConfirmReserveModal,
);

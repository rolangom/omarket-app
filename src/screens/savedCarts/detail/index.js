// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import {
  Container,
  Content,
  List,
  Button,
  Text,
  Icon,
  View,
} from 'native-base';
import type { CartItem, Cart, State } from '../../../common/types';
import Item from './components/Item';
import {
  applyProductsToCart,
  requestDeleteCart,
} from '../../../ducks/savedCarts';
import { showConfirm } from '../../../ducks/global';
import { defaultEmptyArr } from '../../../common/utils/constants';

type Props =
  | Cart
  | {
      applyCartBy: (id: string, remove: boolean) => void,
      applyCart: () => void,
      applyCartRemove: () => void,
      onDeleteCart: (id: string) => void,
      onDelete: () => void,
    };

const styles = {
  basic: {
    padding: 10,
    alignItems: 'flex-end',
  },
  createdAt: {
    textAlign: 'right',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    marginTop: 25,
  },
};

class SavedCartDetailScreen extends React.Component<Props> {
  renderItem = (item: CartItem) => <Item item={item} />;
  render() {
    const {
      name,
      createdAt,
      cartItems,
      applyCart,
      applyCartRemove,
      onDelete,
    } = this.props;
    return (
      <Container>
        <Content whiteBackground>
          <View style={styles.basic}>
            <Text>{name}</Text>
            <Text style={styles.createdAt}>
              {createdAt && new Date(createdAt).toLocaleString('es-DO')}
            </Text>
          </View>
          <List dataArray={cartItems} renderRow={this.renderItem} />

          <View style={styles.buttons}>
            <Button onPress={applyCart}>
              <Text>Aplicar</Text>
            </Button>
            <Button light onPress={applyCartRemove}>
              <Text>Aplicar y eliminar</Text>
            </Button>
            <Button onPress={onDelete}>
              <Icon name="md-trash" />
            </Button>
          </View>
        </Content>
      </Container>
    );
  }
}

SavedCartDetailScreen.defaultProps = {
  name: '-',
  createdAt: new Date(),
  cartItems: defaultEmptyArr,
};

const mapStateToProps = (
  state: State,
  { navigation: { state: { params: { cartId } } } },
) => {
  const cart = state.savedCarts.byId[cartId];
  return cart
    ? {
        id: cartId,
        name: cart.name,
        createdAt: cart.createdAt,
        cartItems: Object.values(cart.content),
      }
    : {};
};

const mapDispatchToProps = dispatch => ({
  applyCartBy: (id: string, remove: boolean) =>
    dispatch(applyProductsToCart(id, remove)),
  onDeleteCart: (id: string) =>
    dispatch(
      showConfirm({
        title: 'Eliminar Lista',
        message: 'Favor confirmar que desea eliminar esta lista.',
        acceptButtonText: 'OK',
        acceptActionType: requestDeleteCart.getType(),
        acceptPayload: id,
      }),
    ),
});

const mergeProps = (stateProps: Props, dispatchProps: Props, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  applyCart: () => dispatchProps.applyCartBy(stateProps.id, false),
  applyCartRemove: () => dispatchProps.applyCartBy(stateProps.id, true),
  onDelete: () => dispatchProps.onDeleteCart(stateProps.id),
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(
  SavedCartDetailScreen,
);

// @flow
import React from 'react';
import { connect } from 'react-redux';
import {
  Container,
  Content,
  List,
  Button,
  Text,
  View,
} from 'native-base';

import CartListItem from './components/list-item';
import PriceView from './components/price-view';
import Ads from '../../common/components/ads';
import type { CartItem, Product, State } from '../../common/types';
import { getCartItems, getCartItemsSubTotalPrice } from '../../ducks/cart/selectors';
import { changeCartProductQty } from '../../ducks/cart';
import { currency } from '../../common/utils/constants';

export type Props = {
  items: CartItem,
  subTotal: number,
  productById: (string) => Product,
  onChangeQty: (string, number) => void,
  onContinueShopping: () => void,
};

const styles = {
  list: {
    paddingTop: 15,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    marginTop: 25,
  },
};

class CartScreen extends React.Component<Props> {
  renderItem = (item: CartItem) => (
    <CartListItem
      item={item}
      product={this.props.productById(item.productID)}
      onChange={this.props.onChangeQty}
    />
  );
  render() {
    const { items, subTotal, onContinueShopping } = this.props;
    return (
      <Container>
        <Content whiteBackground>
          <Ads
            visible
            forceLoad={false}
          />
          <List
            dataArray={items}
            renderRow={this.renderItem}
            style={styles.list}
          />
          <PriceView
            value={subTotal}
            currency={currency}
          />
          <View style={styles.buttons}>
            <Button
              light
              disabled={items.length <= 0}
            >
              <Text>Terminar</Text>
            </Button>
            <Button
              primary
              onPress={onContinueShopping}
            >
              <Text>Continuar comprando</Text>
            </Button>
          </View>
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = (state: State, { navigation }) => ({
  items: getCartItems(state),
  subTotal: getCartItemsSubTotalPrice(state),
  productById: (id: string) => state.products.byId[id],
  onContinueShopping: () => navigation.goBack(null),
});

const mapDispatchToProps = (dispatch) => ({
  onChangeQty: (id: string, qty: number) => dispatch(changeCartProductQty(id, qty)),
});

CartScreen = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CartScreen);

export default CartScreen;

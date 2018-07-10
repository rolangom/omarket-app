// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { Container, Content, List, Button, Text, View } from 'native-base';
import type { CartItem, Cart, State } from '../../../common/types';
import { currency } from '../../../common/utils/constants';
import PriceView from '../../../common/components/price-view';
import Item from './components/Item';

type Props = {
  ...Cart,
};

const styles = {
  basic: {
    padding: 10,
    alignItems: 'flex-end',
  },
  createdAt: {
    textAlign: 'right',
  },
};

class SavedCartDetailScreen extends React.Component<Props> {
  renderItem = (item: CartItem) => (
    <Item item={item} />
  );
  render() {
    const {
      name,
      createdAt,
      cartItems,
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
          {/*<PriceView value={subtotal} currency={`Sub-total ${currency}`} />*/}
          {/*<PriceView*/}
            {/*value={itbis}*/}
            {/*currency={`ITBIS ${itbisFactor * 100}% ${currency}`}*/}
          {/*/>*/}
          {/*<PriceView value={subtotal + itbis} currency={`TOTAL ${currency}`} />*/}
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = (
  state: State,
  { navigation: { state: { params: { cartId } } } },
) => {
  const cart = state.savedCarts.byId[cartId];
  return {
    name: cart.name,
    createdAt: cart.createdAt,
    cartItems: Object.values(cart.content),
  };
};

export default connect(mapStateToProps)(SavedCartDetailScreen);

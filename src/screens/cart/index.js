// @flow
import React from 'react';
import { connect } from 'react-redux';
import {
  Container,
  Content,
  List,
  View,
  Text,
} from 'native-base';

import CartListItem from './list-item';
import Ads from '../../common/components/ads';
import type { CartItem, Product, State } from '../../config/types';
import { getCartItems, getCartItemsSubTotalPrice } from '../../ducks/cart/selectors';
import { changeCartProductQty } from '../../ducks/cart';
import { currency, darkGray } from '../../config/constants';

export type Props = {
  items: CartItem,
  productById: (string) => Product,
  onChangeQty: (string, number) => void,
};

const styles = {
  priceView: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-end',
    backgroundColor: 'white',
    padding: 10,
  },
  priceCurr: {
    fontSize: 18,
    color: darkGray,
    fontFamily: 'Roboto_regular',
  },
  priceValue: {
    fontSize: 26,
    color: darkGray,
    fontFamily: 'Roboto_regular',
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
    const { items, subTotal } = this.props;
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
            style={{ paddingTop: 15 }}
          />
          <View>

            <View style={styles.priceView}>
              <Text style={styles.priceValue}>{subTotal}</Text>
              <Text style={styles.priceCurr}>{currency}</Text>
            </View>
          </View>
        </Content>
      </Container>
    );
  }
}

CartScreen.navigationOptions = {
  headerRight: null,
};

const mapStateToProps = (state: State) => ({
  items: getCartItems(state),
  subTotal: getCartItemsSubTotalPrice(state),
  productById: (id: string) => state.products.byId[id],
});

const mapDispatchToProps = (dispatch) => ({
  onChangeQty: (id: string, qty: number) => dispatch(changeCartProductQty(id, qty))
});

export default connect(mapStateToProps, mapDispatchToProps)(CartScreen);

// @flow
import React from 'react';
import { connect } from 'react-redux';
import {
  Container,
  Content,
  List,
} from 'native-base';

import CartListItem from './list-item';
import Ads from '../../common/components/ads';
import type { CartItem, Product, State } from '../../config/types';
import { getCartItems } from '../../ducks/cart/selectors';
import { changeCartProductQty } from '../../ducks/cart';

export type Props = {
  items: CartItem,
  productById: (string) => Product,
  onChangeQty: (string, number) => void,
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
    const { items } = this.props;
    return (
      <Container>
        <Content>
          <Ads
            visible
            forceLoad={false}
          />
          <List
            dataArray={items}
            renderRow={this.renderItem}
          />
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
  productById: (id: string) => state.products.byId[id],
});

const mapDispatchToProps = (dispatch) => ({
  onChangeQty: (id: string, qty: number) => dispatch(changeCartProductQty(id, qty))
});

export default connect(mapStateToProps, mapDispatchToProps)(CartScreen);

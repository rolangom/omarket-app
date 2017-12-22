// @flow
import React from 'react';
import { connect } from 'react-redux';
import {
  Container,
  Content,
  List,
} from 'native-base';

import CartListItem from './components/list-item';
import PriceView from './components/price-view';
import Ads from '../../common/components/ads';
import type { CartItem, Product, State } from '../../config/types';
import { getCartItems, getCartItemsSubTotalPrice } from '../../ducks/cart/selectors';
import { changeCartProductQty } from '../../ducks/cart';
import { currency } from '../../config/constants';

export type Props = {
  items: CartItem,
  subTotal: number,
  productById: (string) => Product,
  onChangeQty: (string, number) => void,
};

const styles = {
  list: {
    paddingTop: 15,
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
            style={styles.list}
          />
          <PriceView value={subTotal} currency={currency} />
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = (state: State) => ({
  items: getCartItems(state),
  subTotal: getCartItemsSubTotalPrice(state),
  productById: (id: string) => state.products.byId[id],
});

const mapDispatchToProps = (dispatch) => ({
  onChangeQty: (id: string, qty: number) => dispatch(changeCartProductQty(id, qty)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CartScreen);

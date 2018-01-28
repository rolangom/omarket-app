// @flow
import React from 'react';
import { connect } from 'react-redux';
import { Container, Content, List, Body, Text, Right, ListItem } from 'native-base';
// import Prompt from 'react-native-prompt';

import PriceView from '../../../common/components/price-view';
import OptThumbnail from '../../../common/components/opt-thumbnail';
import type { CartItem, Product, State } from '../../../common/types';
import { currency } from '../../../common/utils/constants';
import { getSubtotal } from '../../../ducks/order-requests';

export type Props = {
  items: CartItem,
  subTotal: number,
  productById: string => Product,
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

class OrderRequestDetailScreen extends React.Component<Props> {
  renderItem = (item: CartItem) => {
    const product = this.props.productById(item.productID) || {};
    const { name, descr, price } = item.product || {};
    return (
      <ListItem>
        <OptThumbnail
          uri={product.fileURL}
          size={45}
          borderless
          square
          style={styles.image}
        />
        <Body>
          <Text>{name || product.name}</Text>
          <Text note>{product.descr}</Text>
          <Text note>{descr}</Text>
        </Body>
        <Right>
          <Text>{item.qty}</Text>
          <Text>{price || product.price}</Text>
        </Right>
      </ListItem>
    );
  };
  render() {
    const { items, subTotal } = this.props;
    return (
      <Container>
        <Content whiteBackground>
          <List
            dataArray={items}
            renderRow={this.renderItem}
            style={styles.list}
          />
          {/*<PriceView value={subTotal} currency={currency} />*/}
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = (
  state: State,
  { navigation: { state: { params: { orderRequestID } } } },
) => ({
  orderRequestID,
  items: state.orders.byId[orderRequestID],
  // subTotal: getSubtotal(state, orderRequestID),
  productById: (id: string) => state.products.byId[id],
});

export default connect(mapStateToProps)(OrderRequestDetailScreen);

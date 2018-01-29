// @flow
import React from 'react';
import { connect } from 'react-redux';
import { Container, Content, List, Text, View, Badge } from 'native-base';

import PriceView from '../../../common/components/price-view';
import type {
  CartItem,
  OrderRequest,
  Product,
  State,
} from '../../../common/types';
import { currency } from '../../../common/utils/constants';
import OrderRequestItem from './components/order-request-item';
import AddressDetail from './components/address';
import { getOrderStatusText } from '../../../common/utils';
import OrderRequestDetailPayment from './components/payment';

export type Props = {
  order: OrderRequest,
  productById: string => Product,
};

const styles = {
  basic: {
    padding: 10,
    alignItems: 'flex-end',
  },
  createdAt: {
    textAlign: 'right',
  },
  status: {
    alignSelf: 'flex-end',
  },
};

class OrderRequestDetailScreen extends React.Component<Props> {
  renderItem = (item: CartItem) => (
    <OrderRequestItem item={item} productById={this.props.productById} />
  );
  render() {
    const {
      order: {
        cartItems,
        status,
        createdAt,
        address,
        subtotal,
        itbis,
        itbisFactor,
        creditCard,
        cashFor,
        paymentMethod,
      },
    } = this.props;
    return (
      <Container>
        <Content whiteBackground>
          <View style={styles.basic}>
            <Text style={styles.createdAt}>
              {createdAt && createdAt.toLocaleString('es-DO')}
            </Text>
            <Badge primary style={styles.status}>
              <Text>{getOrderStatusText(status)}</Text>
            </Badge>
          </View>
          <List dataArray={cartItems} renderRow={this.renderItem} />
          <PriceView value={subtotal} currency={`Sub-total ${currency}`} />
          <PriceView
            value={itbis}
            currency={`ITBIS ${itbisFactor * 100}% ${currency}`}
          />
          <PriceView value={subtotal + itbis} currency={`TOTAL ${currency}`} />
          <OrderRequestDetailPayment
            paymentMethod={paymentMethod}
            creditCard={creditCard}
            cashFor={cashFor}
          />
          <AddressDetail address={address} />
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = (
  state: State,
  { navigation: { state: { params: { orderRequestID } } } },
) => ({
  order: state.orders.byId[orderRequestID],
  productById: (id: string) => state.products.byId[id],
});

export default connect(mapStateToProps)(OrderRequestDetailScreen);

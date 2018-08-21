// @flow
import React from 'react';
import { connect } from 'react-redux';
import { Container, Content, List, Text, View, Badge } from 'native-base';

import PriceView from '../../../common/components/price-view';
import type {
  CartItem,
  OrderRequest,
  Product,
  Rating,
  State,
} from '../../../common/types';
import { currency } from '../../../common/utils/constants';
import OrderRequestItem from './components/order-request-item';
import AddressDetail from './components/address';
import { getOrderStatusText, isOrderCompleted } from '../../../common/utils';
import RatingView from './components/rating';
import OrderRequestDetailPayment from './components/payment';
import { postOrderRequestRating } from '../../../ducks/order-requests';

export type Props = {
  order: OrderRequest,
  productById: string => Product,
  onRatingChange: (string, Rating) => void,
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
        creditCard,
        cashFor,
        paymentMethod,
        rating,
        ncf,
        discounts,
        points,
      },
      onRatingChange,
    } = this.props;
    return (
      <Container>
        <Content whiteBackground>
          <View style={styles.basic}>
            <Text style={styles.createdAt}>
              {createdAt && createdAt.toDate().toLocaleString('es-DO')}
            </Text>
            <Badge primary style={styles.status}>
              <Text>{getOrderStatusText(status)}</Text>
            </Badge>
          </View>
          {isOrderCompleted(status) && (
            <RatingView
              rating={rating}
              onRatingChange={onRatingChange}
            />
          )}
          <List dataArray={cartItems} renderRow={this.renderItem} />
          <PriceView value={subtotal} currency={`Sub-total ${currency}`} />
          <PriceView
            value={discounts}
            currency={`- Desc. ${currency}`}
          />
          <PriceView
            value={itbis}
            currency={`+ ITBIS ${currency}`}
          />
          <PriceView value={(subtotal - discounts) + itbis} currency={`= TOTAL ${currency}`} />
          <OrderRequestDetailPayment
            paymentMethod={paymentMethod}
            creditCard={creditCard}
            cashFor={cashFor}
            ncf={ncf}
            points={points}
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

const mapDispatchToProps = (
  dispatch,
  { navigation: { state: { params: { orderRequestID } } } },
) => ({
  onRatingChange: (rating: Rating) =>
    dispatch(postOrderRequestRating(orderRequestID, rating)),
});

export default connect(mapStateToProps, mapDispatchToProps)(
  OrderRequestDetailScreen,
);

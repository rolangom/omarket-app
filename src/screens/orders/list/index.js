// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import {
  Container,
  Content,
  List,
  ListItem,
  Text,
  Body,
  Left,
  Right,
  Icon,
} from 'native-base';

import UserContent from '../../../common/components/user-content';
import Link from '../../../common/components/link';
import { fetchOrderRequests } from '../../../ducks/order-requests';
import type { OrderRequest, State } from '../../../common/types';
import { lightGray, red } from '../../../common/utils/constants';

type Props = {
  items: OrderRequest[],
  fetchItems: () => void,
};

const styles = {
  text: {
    color: lightGray,
    fontSize: 22,
  },
  icon: {
    fontSize: 24,
    color: lightGray,
  },
};

const mapStateToProps = (state: State, props: Props) => ({
  items: Object.values(state.orders.byId),
});

const mapDispatchToProps = dispatch => ({
  fetchItems: () => dispatch(fetchOrderRequests()),
});

@connect(mapStateToProps, mapDispatchToProps)
export default class OrderListScreen extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchItems();
  }
  renderRow = (orderRequest: OrderRequest) => (
    <Link
      component={ListItem}
      button
      to="OrdersRequestDetail"
      params={{ orderRequestID: orderRequest.id }}
    >
      <Body>
        <Text>
          {orderRequest.createdAt &&
            orderRequest.createdAt.toLocaleString('es-DO')}
        </Text>
        <Text note>{orderRequest.status}</Text>
      </Body>
      <Right>
        <Icon name="ios-arrow-forward" style={styles.icon} />
      </Right>
    </Link>
  );
  render() {
    return (
      <Container>
        <Content>
          <UserContent>
            <List dataArray={this.props.items} renderRow={this.renderRow} />
          </UserContent>
        </Content>
      </Container>
    );
  }
}

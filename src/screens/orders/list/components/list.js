// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { List } from 'native-base';

import type { OrderRequest, State } from '../../../../common/types';
import { initOrderRequestsSubcr } from '../../../../config/app';
import Item from './item';

type Props = {
  items: OrderRequest[],
  dispatch: Object => void,
};

const mapStateToProps = (state: State) => ({
  items: Object.values(state.orders.byId),
});

@connect(mapStateToProps)
export default class OrderListScreen extends React.Component<Props> {
  componentDidMount() {
    this.unsubscr = initOrderRequestsSubcr(this.props.dispatch);
  }
  componentWillUnmount() {
    this.unsubscr && this.unsubscr();
  }
  unsubscr = null;
  renderRow = ({ id, status, createdAt }: OrderRequest) => (
    <Item
      id={id}
      status={status}
      createdAt={createdAt}
    />
  );
  render() {
    return (
      <List
        dataArray={this.props.items}
        renderRow={this.renderRow}
      />
    );
  }
}

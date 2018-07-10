// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { List } from 'native-base';

import type { OrderRequest, State } from '../../../../common/types';
import { fetchCarts } from '../../../../ducks/savedCarts';
import Item from './Item';

type Props = {
  items: OrderRequest[],
  fetchCarts: () => void,
};

const mapStateToProps = (state: State) => ({
  items: Object.values(state.savedCarts.byId),
});

const mapDispatchToProps = {
  fetchCarts,
};

@connect(mapStateToProps, mapDispatchToProps)
export default class SavedCartListScreen extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchCarts();
  }
  renderRow = ({ id, name, createdAt }: OrderRequest) => (
    <Item id={id} name={name} createdAt={createdAt} />
  );
  render() {
    return <List dataArray={this.props.items} renderRow={this.renderRow} />;
  }
}

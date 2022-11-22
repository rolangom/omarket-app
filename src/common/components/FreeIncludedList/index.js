// @flow
import * as React from 'react';
import { compose, branch, renderNothing, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { View, Text, List } from 'native-base';
import type { Product, Offer, State } from '../../types';
import { defaultEmptyArr } from '../../utils/constants';
import Item from './Item';
import { isOfferFreeIncluded } from '../../utils';

type ProdOfferItem = {
  qty: number,
  productId?: String,
  product?: Product,
};

type Props = {
  offer: Offer,
  items: ProdOfferItem[],
  renderRow(ProdOfferItem): React.Node<*>,
};

export const FreeIncluded = ({ items, renderRow }: Props) => (
  <View>
    <Text note>Incluye gratis:</Text>
    <List
      dataArray={items}
      renderRow={renderRow}
    />
  </View>
);

const mapStateToProps = (state: State, { offer }: Props): Props => ({
  items: (offer.products || defaultEmptyArr).map(
    ({ qty, productId }: ProdOfferItem) => ({
      qty,
      product: state.products.byId[productId],
    }),
  ),
});

const enhance = compose(
  branch((props: Props) => !isOfferFreeIncluded(props.offer), renderNothing),
  connect(mapStateToProps),
  withHandlers({
    renderRow: (props: Props) => (item: ProdOfferItem) => (
      <Item item={item} />
    ),
  })
);

export default enhance(FreeIncluded);

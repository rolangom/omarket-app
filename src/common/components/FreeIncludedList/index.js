// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { View, Text, List } from 'native-base';
import type { Product, State } from '../../types';
import { defaultEmptyArr } from '../../utils/constants';
import Item from './Item';

type ProdOfferItem = {
  qty: number,
  productId?: String,
  product?: Product,
};

type Props = {
  offerId: String,
  items: ProdOfferItem[],
};

export const FreeIncluded = ({ items }: Props) => (
  <View>
    <Text note>Incluye gratis:</Text>
    <List
      dataArray={items}
      renderRow={(item: ProdOfferItem) => (
        <Item item={item} />
      )}
    />
  </View>
);

const mapStateToProps = (state: State, { offerId }: Props) => {
  const offer = state.offers.byId[offerId];
  return {
    items: (offer.products || defaultEmptyArr).map(
      ({ qty, productId }: ProdOfferItem) => ({
        qty,
        product: state.products.byId[productId],
      }),
    ),
  };
};

export default connect(mapStateToProps)(FreeIncluded);

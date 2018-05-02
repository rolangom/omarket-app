// @flow
import * as React from 'react';
import { ListItem, Text } from 'native-base';
import type { Product } from '../../types';

type Props = {
  item?: {
    qty: ?string | ?number,
    product: Product,
  },
};

const Item = ({ item }: Props) => (
  <ListItem>
    <Text note>
      {item.qty}x {item.product.name}
    </Text>
  </ListItem>
);

Item.defaultProps = {
  item: {
    qty: '-',
    product: {
      name: '-',
    },
  },
};

export default Item;

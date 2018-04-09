// @flow

import * as React from 'react';
import { ListItem, Body, Text, Right } from 'native-base';
import OptThumbnail from '../../../../../common/components/opt-thumbnail';
import { getPriceWithCurrency } from '../../../../../common/utils';
import type { CartItem, Product } from '../../../../../common/types';

type Props = {
  item: CartItem,
  productById: (id: string) => Product,
};

const OrderRequestItem = ({ item, productById }: Props) => {
  const product = productById(item.productID) || {};
  const { name, price } = item.product || {};
  return (
    <ListItem>
      <OptThumbnail uri={product.fileURL} size={45} borderless square />
      <Body>
        <Text>{name}</Text>
        <Text note>{product.descr}</Text>
        <Text note>{item.descr}</Text>
      </Body>
      <Right>
        <Text>{item.qty} x</Text>
        <Text>{getPriceWithCurrency(price)}</Text>
        <Text>{getPriceWithCurrency(price * item.qty)}</Text>
      </Right>
    </ListItem>
  );
};

export default OrderRequestItem;
// @flow

import * as React from 'react';
import { ListItem, Body, Text, Right } from 'native-base';
import OptThumbnail from 'src/common/components/opt-thumbnail';
import { getPriceWithCurrency } from 'src/common/utils';
import type { CartItem, Product } from 'src/common/types';
import FreeIncludedList from 'src/common/components/FreeIncludedList/Products';
import { defaultEmptyObj } from 'src/common/utils/constants';

type Props = {
  item: CartItem,
  productById: (id: string) => Product,
};

const OrderRequestItem = ({ item, productById }: Props) => {
  const product = productById(item.productID) || defaultEmptyObj;
  const { name, price } = item.product || defaultEmptyObj;
  return (
    <ListItem>
      <OptThumbnail uri={product.fileURL} size={45} borderless square />
      <Body>
        <Text>{name}</Text>
        <Text note>{product.descr}</Text>
        <Text note>{item.descr}</Text>
        <FreeIncludedList offer={item.offer} />
      </Body>
      <Right>
        <Text>{item.qty} x</Text>
        <Text>{getPriceWithCurrency(price)}</Text>
        <Text>{getPriceWithCurrency(price * item.qty)}</Text>
      </Right>
    </ListItem>
  );
};

OrderRequestItem.defaultProps = {
  item: {
    product: defaultEmptyObj,
  },
};

export default OrderRequestItem;

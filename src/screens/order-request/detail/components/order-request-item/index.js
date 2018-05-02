// @flow

import * as React from 'react';
import { ListItem, Body, Text, Right } from 'native-base';
import OptThumbnail from '../../../../../common/components/opt-thumbnail';
import { getPriceWithCurrency, isOfferFreeIncluded } from '../../../../../common/utils';
import type { CartItem, Product } from '../../../../../common/types';
import FreeIncludedList from '../../../../../common/components/FreeIncludedList/Products';

type Props = {
  item: CartItem,
  productById: (id: string) => Product,
};

const OrderRequestItem = ({ item, productById }: Props) => {
  const product = productById(item.productID) || {};
  const { name, price } = item.product || {};
  const freeIncludedOffer = item.offer && isOfferFreeIncluded(item.offer) && item.offer;
  return (
    <ListItem>
      <OptThumbnail uri={product.fileURL} size={45} borderless square />
      <Body>
        <Text>{name}</Text>
        <Text note>{product.descr}</Text>
        <Text note>{item.descr}</Text>
        {freeIncludedOffer &&
          <FreeIncludedList offer={freeIncludedOffer} />
        }
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
    product: {},
  },
};

export default OrderRequestItem;

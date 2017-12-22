// @flow
import React from 'react';
import {
  ListItem,
  Text,
  Body,
  Right,
} from 'native-base';
import OptThumbnail from '../../../common/components/opt-thumbnail';
import QtyInput from '../../../common/components/qty-input/index';
import type { CartItem, Product } from '../../../config/types';
import { lightGray } from '../../../config/constants';

export type Props = {
  item: CartItem,
  product: Product,
  onChange: (string, number) => void,
};

const styles = {
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    height: 45,
  },
  text: {
    color: lightGray,
    textAlign: 'center',
  },
  image: {
    height: 45,
    width: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
};

class CartListItem extends React.Component<Props> {
  onChange = (qty: number) => this.props.onChange(this.props.item.productID, qty);
  render() {
    const { product, item } = this.props;
    return (
      <ListItem>
        <OptThumbnail
          uri={product.fileURL}
          size={45}
          borderless
          square
          style={styles.image}
        />
        <Body>
          <Text>{product.name}</Text>
          <Text note>{product.descr}</Text>
        </Body>
        <Right>
          <QtyInput
            styled
            value={item.qty}
            max={product.qty}
            onChange={this.onChange}
          />
        </Right>
      </ListItem>
    );
  }
}

export default CartListItem;

// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { ListItem, Text, Body, Right, View } from 'native-base';
import OptThumbnail from 'src/common/components/opt-thumbnail';
import QtyInput from 'src/common/components/qty-input/index';
import type { CartItem, Product, Offer, State } from 'src/common/types';
import {
  currency,
  defaultEmptyArr,
  lightGray,
  red,
} from 'src/common/utils/constants';
import { getOfferPrice, isOfferFreeIncluded, getPriceWithTax } from 'src/common/utils';
import FreeIncludedList from 'src/common/components/FreeIncludedList';
import { flex1 } from 'src/common/utils/styles';

export type Props = {
  item: CartItem,
  offer: ?Offer,
  product: Product,
  onChange?: (string, number) => void,
  onEditPress?: string => void,
};

const styles = {
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 0.75,
  },
  text: {
    color: lightGray,
    textAlign: 'center',
  },
  subtotal: {
    flex: 1,
    textAlign: 'right',
    fontWeight: 'bold',
    color: red,
  },
  image: {
    height: 45,
    width: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
};

class CartListItem extends React.Component<Props> {
  onChange = (qty: number) =>
    this.props.onChange(this.props.item.productID, qty);
  onEditPress = () => this.props.onEditPress(this.props.item.productID);
  render() {
    const { product, item, offer } = this.props;
    const price = getPriceWithTax(product.price, product.taxFactor, offer);
    const subtotal = getPriceWithTax(product.price, product.taxFactor, offer, null, item.qty);
    return (
      <ListItem button onPress={this.onEditPress}>
        <OptThumbnail
          uri={product.fileURL}
          size={45}
          borderless
          square
          style={styles.image}
        />
        <Body style={flex1}>
          <Text numberOfLines={1}>{offer ? offer.title : product.name}</Text>
          <FreeIncludedList offer={offer} />
          <Text numberOfLines={1} note>{item.descr || product.descr}</Text>
          <Text note>${price}</Text>
        </Body>
        <View style={styles.row}>
          <QtyInput
            stretch
            value={item.qty}
            max={product.qty}
            onChange={this.onChange}
          />
          <Text style={styles.subtotal}>${subtotal}</Text>
        </View>
      </ListItem>
    );
  }
}

const mapStateToProps = (state: State, { productId: id }) => {
  const [offerId] = state.offers.rel[id] || defaultEmptyArr;
  return {
    product: state.products.byId[id],
    offer: state.offers.byId[offerId],
  };
};

export default connect(mapStateToProps)(CartListItem);

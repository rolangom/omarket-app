// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { ListItem, Text, Body, Right } from 'native-base';
import OptThumbnail from '../../../../common/components/opt-thumbnail';
import type { CartItem, Product, Offer, State } from '../../../../common/types';
import {
  currency,
  defaultEmptyArr,
  lightGray,
} from '../../../../common/utils/constants';
import {
  getOfferPrice,
  getPriceWithCurrency,
  isOfferFreeIncluded,
} from '../../../../common/utils';
import FreeIncludedList from '../../../../common/components/FreeIncludedList';

export type Props = {
  item: CartItem,
  offer: ?Offer,
  product: Product,
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
  render() {
    const { product, item, offer } = this.props;
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
          <Text>{offer ? offer.title : product.name}</Text>
          <Text note>
            {currency}
            {offer ? getOfferPrice(product.price, offer) : product.price}
            {'-'}
            {product.descr}
          </Text>
          {offer &&
            isOfferFreeIncluded(offer) && (
              <FreeIncludedList offerId={offer.id} />
            )}
          <Text note>{item.descr}</Text>
        </Body>
        <Right>
          <Text>{item.qty} x</Text>
          <Text>{getPriceWithCurrency(product.price)}</Text>
          <Text>{getPriceWithCurrency(product.price * item.qty)}</Text>
        </Right>
      </ListItem>
    );
  }
}

const mapStateToProps = (state: State, { item: { productID } }: Props) => {
  const [offerId] = state.offers.rel[productID] || defaultEmptyArr;
  return {
    product: state.products.byId[productID],
    offer: state.offers.byId[offerId],
  };
};

export default connect(mapStateToProps)(CartListItem);

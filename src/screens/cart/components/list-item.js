// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import {
  ListItem,
  Text,
  Body,
  Right,
} from 'native-base';
import OptThumbnail from '../../../common/components/opt-thumbnail';
import QtyInput from '../../../common/components/qty-input/index';
import type { CartItem, Product, Offer, State } from '../../../common/types';
import {currency, defaultEmptyArr, lightGray} from '../../../common/utils/constants';
import {getOfferPrice, isOfferFreeIncluded} from "../../../common/utils";
import FreeIncludedList from '../../../common/components/FreeIncludedList';

export type Props = {
  item: CartItem,
  offer: ?Offer,
  product: Product,
  onChange: (string, number) => void,
  onEditPress: (string) => void,
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
  onEditPress = () => this.props.onEditPress(this.props.item.productID);
  render() {
    const { product, item, offer } = this.props;
    return (
      <ListItem button onPress={this.onEditPress}>
        <OptThumbnail
          uri={product.fileURL}
          size={45}
          borderless
          square
          style={styles.image}
        />
        <Body>
          <Text>
            {offer ? offer.title : product.name}
          </Text>
          <Text note>
            {currency}{offer ? getOfferPrice(product.price, offer) : product.price}{'-'}
            {product.descr}
          </Text>
          {offer && isOfferFreeIncluded(offer) &&
            <FreeIncludedList offerId={offer.id} />
          }
          <Text note>{item.descr}</Text>
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

const mapStateToProps = (state: State, { product: { id } }) => {
  const [offerId] = state.offers.rel[id] || defaultEmptyArr;
  return {
    offer: state.offers.byId[offerId],
  };
};

export default connect(mapStateToProps)(CartListItem);

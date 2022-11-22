// @flow
import * as React from 'react';
import type { Dispatch } from 'redux';
import {
  compose,
  withHandlers,
  withProps,
  flattenProp,
  defaultProps,
} from 'recompose';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import { View, Dimensions, TouchableOpacity, StyleSheet } from 'react-native';
import { Text, Button } from 'native-base';

import OptImage from 'src/common/components/opt-image';
import { getPriceWithTax, isOfferDiscount } from 'src/common/utils';
import { priceReg } from 'src/common/utils/styles';
import {
  darkerGray,
  darkGray,
  gray,
  red,
  lighterGray,
  defaultEmptyArr,
  defaultQty0,
  currency,
} from 'src/common/utils/constants';
import type { Offer, Product, State, CartItem } from 'src/common/types';
import { setShowRelatedProdId } from 'src/ducks/global';
import Maybe from 'src/common/components/Maybe';
import QtyForm from 'src/common/components/qty-form';
import { changeCartProductQty } from 'src/ducks/cart';

export type Props = Product & {
  priceWithOfferAndCurr: string,
  priceWithCurr: string,
  offer: ?Offer,
  isOfferDisc: boolean,
  cartItem: CartItem,
  size?: number,
  imgStyle?: { width: number, height: number },
  navigation: { navigate(string, Object): void },
  onNavigateProduct(): void,
  hideRelatedProductIdModal(): void,
};

const { width } = Dimensions.get('window');
const size = width * 0.5 - 2;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    margin: 1,
  },
  item: {
    flexDirection: 'column',
    width: size,
  },
  content: {
    backgroundColor: lighterGray,
    padding: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  imgStyle: {
    width: size,
    height: size * 1.15,
  },
  title: {
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'Roboto_regular',
    fontWeight: 'bold',
    color: darkerGray,
  },
  subtitle: {
    fontFamily: 'Roboto_regular',
    textAlign: 'center',
    fontSize: 12,
    color: gray,
  },
  price: {
    fontFamily: 'Roboto_regular',
    textAlign: 'center',
    fontSize: 14,
    color: red,
  },
  priceReg: {
    fontFamily: 'Roboto_regular',
    textAlign: 'center',
    fontSize: 8,
    color: darkGray,
    textDecorationLine: 'line-through',
  },
});

const ProductListItem = ({
  id,
  size,
  offer,
  imgStyle,
  name,
  descr,
  pricePer,
  cartItem,
  fileURL,
  onChangeQty,
  onNavigateProduct,
  priceWithOfferAndCurr,
  isOfferDisc,
  priceWithCurr,
}: Props) => (
  <TouchableOpacity onPress={onNavigateProduct} style={styles.container}>
    <View style={{ width: size }}>
      <OptImage uri={fileURL} size={size} imgStyle={imgStyle} />
      <View style={styles.row}>
        <Text style={styles.price}>{priceWithOfferAndCurr}</Text>
        <Maybe visible={isOfferDisc} component={Text} style={priceReg}>
          {priceWithCurr}
        </Maybe>
      </View>
      <Text style={styles.title} numberOfLines={1}>
        {name}
      </Text>
      <Text style={styles.subtitle} numberOfLines={1} note>
        {pricePer}
      </Text>
      <QtyForm
        productID={id}
        offerID={offer && offer.id}
        value={cartItem.qty}
        onChange={onChangeQty}
      />
    </View>
  </TouchableOpacity>
);

const mapStateToProps = (state: State, { id }: Props): Props => {
  const [offerId] = state.offers.rel[id] || defaultEmptyArr;
  const cartItem = state.cartItems.byId[id] || defaultQty0;
  return {
    offer: state.offers.byId[offerId],
    cartItem,
  };
};

const mapDispatchToProps = (dispatch: Dispatch, props: Props): Props => ({
  hideRelatedProductIdModal: () => dispatch(setShowRelatedProdId(null)),
  onChangeQty: (qty: number) => dispatch(changeCartProductQty(props.id, qty)),
});

const enhance = compose(
  defaultProps({ size, imgStyle: styles.imgStyle, pricePer: 'Unidad.' }),
  flattenProp('item'),
  connect(mapStateToProps, mapDispatchToProps),
  withNavigation,
  withHandlers({
    onNavigateProduct: (props: Props) => () => {
      // console.log('Product List item onNavigate', props);
      props.navigation.navigate('ProductDetail', { productID: props.id });
      props.hideRelatedProductIdModal();
    },
  }),
  withProps((props: Props): Props => {
    const isOfferDisc: boolean = isOfferDiscount(props.offer);
    return {
      isOfferDisc,
      priceWithOfferAndCurr: getPriceWithTax(
        props.price,
        props.taxFactor,
        props.offer,
        currency,
      ),
      name: props.offer ? props.offer.title : props.name,
      priceWithCurr: isOfferDisc
        ? getPriceWithTax(props.price, props.taxFactor, null, currency)
        : '-',
    };
  }),
);

export default enhance(ProductListItem);

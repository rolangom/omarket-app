// @flow
import * as React from 'react';
import type { Dispatch } from 'redux';
import { compose, withHandlers, withProps, flattenProp, defaultProps } from 'recompose';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import { View, Dimensions, TouchableOpacity, StyleSheet } from 'react-native';
import { Text, Button } from 'native-base';
import OptImage from '../../../../common/components/opt-image';
import {
  getPriceWithTax,
  isOfferDiscount,
} from '../../../../common/utils';
import {
  darkGray,
  lighterGray,
  defaultEmptyArr,
} from '../../../../common/utils/constants';
import type { Offer, Product, State } from '../../../../common/types';
import { incrCartProduct } from '../../../../ducks/cart';
import { setShowRelatedProdId } from '../../../../ducks/global';
import Maybe from '../../../../common/components/Maybe';

export type Props = Product & {
  priceWithOfferAndCurr: string,
  priceWithCurr: string,
  offer: ?Offer,
  isOfferDisc: boolean,
  size?: number,
  imgStyle?: { width: number, height: number },
  addButton: boolean,
  navigation: { navigate(string, Object): void },
  add1ToCart(): void,
  onNavigateProduct(): void,
  hideRelatedProductIdModal(): void,
};

const { width } = Dimensions.get('window');
const size = (width * 0.5) - 4;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    margin: 2,
    paddingBottom: 10,
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
  },
  imgStyle: {
    width: size,
    height: size * 1.15,
  },
  title: {
    fontSize: 12,
    flex: 1,
    fontFamily: 'Roboto_regular',
    fontWeight: 'bold',
    color: darkGray,
  },
  subtitle: {
    fontFamily: 'Roboto_regular',
    fontSize: 10,
    color: darkGray,
  },
  price: {
    fontFamily: 'Roboto_regular',
    fontSize: 10,
    color: darkGray,
  },
  priceReg: {
    fontFamily: 'Roboto_regular',
    fontSize: 8,
    color: darkGray,
    textDecorationLine: 'line-through',
  },
});

const ProductListItem = ({
  size,
  imgStyle,
  name,
  descr,
  fileURL,
  addButton,
  add1ToCart,
  onNavigateProduct,
  priceWithOfferAndCurr,
  isOfferDisc,
  priceWithCurr,
}: Props) => (
  <TouchableOpacity onPress={onNavigateProduct} style={styles.container}>
    <View style={{ width: size }}>
      <OptImage uri={fileURL} size={size} imgStyle={imgStyle} />
      <Maybe
        visible={addButton}
        component={Button}
        onPress={add1ToCart}
        block
        light
      >
        <Text>+1</Text>
      </Maybe>
      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.title} numberOfLines={1}>
            {name}
          </Text>
          <View>
            <Text style={styles.price}>{priceWithOfferAndCurr}</Text>
            <Maybe
              visible={isOfferDisc}
              component={Text}
              style={styles.priceReg}
            >
              {priceWithCurr}
            </Maybe>
          </View>
        </View>
        <Text style={styles.subtitle} numberOfLines={2} note>
          {descr}
        </Text>
      </View>
    </View>
  </TouchableOpacity>
);

const mapStateToProps = (state: State, { id }: Props): Props => {
  const [offerId] = state.offers.rel[id] || defaultEmptyArr;
  return {
    offer: state.offers.byId[offerId],
  };
};

const mapDispatchToProps = (dispatch: Dispatch, props: Props): Props => ({
  hideRelatedProductIdModal: () => dispatch(setShowRelatedProdId(null)),
  add1ToCart: (offer: Offer) =>
    dispatch(incrCartProduct(props.id, offer && offer.id)),
});

const mergeProps = (statePros: Props, dispatchProps: Props, ownProps: Props): Props => ({
  ...statePros,
  ...dispatchProps,
  ...ownProps,
  add1ToCart: () => dispatchProps.add1ToCart(statePros.offer),
});

const enhance = compose(
  defaultProps({ size, imgStyle: styles.imgStyle }),
  flattenProp('item'),
  connect(mapStateToProps, mapDispatchToProps, mergeProps),
  withNavigation,
  withHandlers({
    onNavigateProduct: (props: Props) => () => {
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
        true,
      ),
      name: props.offer ? props.offer.title : props.name,
      priceWithCurr: isOfferDisc
        ? getPriceWithTax(props.price, props.taxFactor, null, true)
        : '-',
    };
  }),
);

export default enhance(ProductListItem);

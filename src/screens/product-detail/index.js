// @flow
import React from 'react';
import type { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Dimensions, StyleSheet } from 'react-native';
import { Container, Text, View } from 'native-base';
import { Constants } from 'expo';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import OptImage from '../../common/components/opt-image';
import QtyForm from '../../common/components/qty-form';
import CondContent from '../../common/components/cond-content';
import RelatedProductsDialog from '../../common/components/RelatedProductsDialog';
import { darkGray, defaultEmptyArr } from '../../common/utils/constants';
import type { Product, State, Offer } from '../../common/types';
import { postCartProduct } from '../../ducks/cart';
import {
  isOfferDiscount,
  isOfferFreeIncluded,
  getPriceWithTax,
} from '../../common/utils';
import Price from './components/Price';
import FreeIncludedList from '../../common/components/FreeIncludedList';
import BrandRelatedHList from '../../common/components/BrandRelatedHList';
import Maybe from '../../common/components/Maybe';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  footer: {
    height: Constants.statusBarHeight * 3,
  },
  image: {
    width: width - 10,
    height: (width - 10) * 1.15,
  },
  detail: {
    padding: 10,
    backgroundColor: 'white',
  },
  detailTitle: {
    fontSize: 16,
    color: darkGray,
    fontFamily: 'Roboto_regular',
  },
  detailSubtitle: {
    fontSize: 12,
    color: darkGray,
    fontFamily: 'Roboto_regular',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
});

export type Props = {
  product: Product,
  offer: ?Offer,
  doHaveRelated: boolean,
  navigation: {
    state: { params: Object },
    navigate(string, Object): void,
  },
  onSubmit(number): void,
  onSubmitWithOffer(value: number, offerID: string, noNavigate: boolean): void,
};

class ProductDetailScreen extends React.Component<Props> {
  render() {
    const {
      product: { id, price, name, descr, qty, fileURL, taxFactor },
      offer,
      onSubmit,
    } = this.props;
    const finalTitle = offer ? offer.title : name;
    const secureQty = parseInt(qty, 10);
    const priceWithOfferAndTax = getPriceWithTax(price, taxFactor, offer);
    const priceWithTax = getPriceWithTax(price, taxFactor, null);
    const isOfferDisc = isOfferDiscount(offer);
    return (
      <Container>
        <KeyboardAwareScrollView>
          <View style={styles.content}>
            <View>
              <Price amount={priceWithOfferAndTax} />
              <Maybe
                visible={isOfferDisc}
                component={Price}
                amount={priceWithTax}
                isSub
              />
            </View>
            <View style={styles.center}>
              <OptImage uri={fileURL} size={width} imgStyle={styles.image} />
            </View>
            <View style={styles.detail}>
              <Text style={styles.detailTitle}>
                {finalTitle}
              </Text>
              {offer && (
                <Text style={styles.detailSubtitle}>
                  Oferta válida:{' '}
                  {offer.beginDate.toLocaleDateString()} - {offer.endDate.toLocaleDateString()}
                </Text>
              )}
              <Text style={styles.detailSubtitle}>{descr}</Text>
              {isOfferFreeIncluded(offer) && (
                <FreeIncludedList offerId={offer.id} />
              )}
            </View>
            <BrandRelatedHList productId={id} />
            <RelatedProductsDialog />
          </View>
        </KeyboardAwareScrollView>
        <View style={styles.footer}>
          <CondContent
            cond={secureQty > 0}
            defaultText="Existencia 0"
            containerStyle={styles.detail}
          >
            <QtyForm defaultValue={1} max={secureQty} onSubmit={onSubmit} />
          </CondContent>
        </View>
      </Container>
    );
  }
}

const mapStateToProps = (
  state: State,
  { navigation: { state: { params: { productID } } } }: Props,
): Props => {
  const product = state.products.byId[productID];
  const doHaveRelated = Object.keys(product.relatedProds).length > 0;
  const [offerId] = state.offers.rel[productID] || defaultEmptyArr;
  return {
    offer: state.offers.byId[offerId],
    product,
    doHaveRelated,
  };
};
const mapDispatchToProps = (
  dispatch: Dispatch,
  { navigation: { state: { params: { productID } } } }: Props,
): Props => ({
  onSubmitWithOffer: (value: number, offerID: string, noNavigate: boolean) =>
    dispatch(postCartProduct(productID, value, offerID, noNavigate)),
});

const mergeProps = (
  stateProps: Props,
  dispatchProps: Props,
  ownProps: Props,
): Props => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  onSubmit: (value: number) =>
    dispatchProps.onSubmitWithOffer(
      value,
      (stateProps.offer && stateProps.offer.id) || null,
      stateProps.doHaveRelated,
    ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(ProductDetailScreen);

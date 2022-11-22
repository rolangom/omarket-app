// @flow
import React from 'react';
import type { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Dimensions, StyleSheet, ScrollView } from 'react-native';
import { Container, Content, Text, View, H3 } from 'native-base';

import OptImage from 'src/common/components/opt-image';
import QtyForm from 'src/common/components/qty-form';
import CondContent from 'src/common/components/cond-content';
import { darkGray, defaultEmptyArr, defaultQty0 } from 'src/common/utils/constants';
import type { Product, State, Offer } from 'src/common/types';
import { isOfferDiscount, getPriceWithTax } from 'src/common/utils';
import Price from './components/Price';
import FreeIncludedList from 'src/common/components/FreeIncludedList';
import BrandRelatedHList from 'src/common/components/BrandRelatedHList';
import Maybe from 'src/common/components/Maybe';
import OfferDetailText from './components/OfferDetailText';
import NutritionFacts from './components/NutritionFacts';
import TabHostButton from './components/TabHostButton';
import SearchButton from '../home/components/search/button';
import { lighterGray, currency } from 'src/common/utils/constants';
import { flex1, row, priceReg } from 'src/common/utils/styles';
import { changeCartProductQty } from 'src/ducks/cart';
import type { CartItem } from 'src/common/types';
import {darkerGray, gray} from "../../common/utils/constants";

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  image: {
    width: width,
    height: width * 1.15,
  },
  detail: {
    padding: 10,
    backgroundColor: 'white',
  },
  bottom: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: lighterGray,
  },
  detailTitle: {
    fontSize: 18,
    color: darkerGray,
    fontFamily: 'Roboto_regular',
  },
  detailSubtitle: {
    fontSize: 16,
    color: gray,
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
  cartItem: CartItem,
  doHaveRelated: boolean,
  navigation: {
    state: { params: Object },
    navigate(string, Object): void,
  },
  onChangeQty(number): void,
  // onSubmitWithOffer(value: number, offerID: string, noNavigate: boolean): void,
};

class ProductDetailScreen extends React.Component<Props> {
  render() {
    const {
      product: {
        id,
        price,
        pricePer = 'Unidad.',
        name,
        descr,
        qty,
        fileURL,
        nutriFactsURL,
        nutritionFacts,
        taxFactor,
      },
      offer,
      cartItem,
      onChangeQty,
      // onSubmit,
    } = this.props;
    const finalTitle = offer ? offer.title : name;
    const secureQty = parseInt(qty, 10);
    const priceWithOfferAndTax = getPriceWithTax(price, taxFactor, offer, currency);
    const priceWithTax = getPriceWithTax(price, taxFactor, null, currency);
    const isOfferDisc = isOfferDiscount(offer);
    return (
      <Container>
        <SearchButton />
        <Content>
          <OptImage resizeMode="contain" uri={fileURL} size={width} imgStyle={styles.image} />
          <View style={styles.detail}>
            <View style={row}>
              <Text primary>
                {priceWithOfferAndTax}
              </Text>
              <Maybe
                visible={isOfferDisc}
                component={Text}
                style={priceReg}
              >
                {priceWithTax}
              </Maybe>
            </View>
            <Text style={styles.detailTitle}>{finalTitle}</Text>
            <OfferDetailText offer={offer} style={styles.detailSubtitle} />
            <Text style={styles.detailSubtitle}>{pricePer}</Text>
            <FreeIncludedList offer={offer} />
            <TabHostButton
              tab1Text="Más información"
              tab2Text="Información Nutricional"
              content1={
                <Text style={styles.detailSubtitle}>{descr}</Text>
              }
              content2={
                <Maybe
                  visible={!!nutritionFacts}
                  component={NutritionFacts}
                  text={nutritionFacts}
                />
              }
            >
              <BrandRelatedHList productId={id} />
            </TabHostButton>
          </View>
          <Maybe
            visible={!!nutriFactsURL}
            component={OptImage}
            resizeMode="contain"
            uri={nutriFactsURL}
            size={width}
            imgStyle={styles.image}
          />
        </Content>
        <CondContent
          cond={secureQty > 0}
          defaultText="Existencia 0"
          containerStyle={styles.bottom}
        >
          <QtyForm
            flex
            productID={id}
            offerID={offer && offer.id}
            value={cartItem.qty}
            onChange={onChangeQty}
          />
        </CondContent>
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
  const cartItem = state.cartItems.byId[productID] || defaultQty0;
  return {
    offer: state.offers.byId[offerId],
    product,
    cartItem,
    doHaveRelated,
  };
};

const mapDispatchToProps = (
  dispatch: Dispatch,
  { navigation: { state: { params: { productID } } } }: Props,
): Props => ({
  onChangeQty: (qty: number) => dispatch(changeCartProductQty(productID, qty)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProductDetailScreen);

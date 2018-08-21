// @flow
import React from 'react';
import { connect } from 'react-redux';
import { Dimensions } from 'react-native';
import { Container, Content, Text, View } from 'native-base';

import OptImage from '../../common/components/opt-image';
import QtyForm from '../../common/components/qty-form';
import CondContent from '../../common/components/cond-content';
import RelatedProductsDialog from '../../common/components/RelatedProductsDialog';
import {
  darkGray,
  defaultEmptyArr,
} from '../../common/utils/constants';
import type { Product, State, Offer } from '../../common/types';
import { postCartProduct } from '../../ducks/cart';
import { getOfferPrice, isOfferDiscount, isOfferFreeIncluded } from '../../common/utils';
import Price from './components/Price';
import FreeIncludedList from '../../common/components/FreeIncludedList';
import BrandRelatedHList from '../../common/components/BrandRelatedHList';

const { width } = Dimensions.get('window');

const styles = {
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
};

export type Props = {
  product: Product,
  offer: Offer,
  onSubmit: number => void,
  navigation: { navigate: (string, Object) => void },
  doHaveRelated: boolean,
};

class ProductDetailScreen extends React.Component<Props> {
  onNavigateProduct = (id: string) =>
    this.props.navigation.navigate('ProductDetail', { productID: id });
  render() {
    const {
      product: { id, price, name, descr, qty, fileURL },
      offer,
      onSubmit,
    } = this.props;
    const secureQty = parseInt(qty, 10);
    return (
      <Container>
        <Content>
          <View>
            <Price amount={offer ? getOfferPrice(price, offer) : price} />
            {offer && isOfferDiscount(offer) &&
              <Price isSub amount={price} />
            }
          </View>
          <View style={styles.center}>
            <OptImage uri={fileURL} size={width} imgStyle={styles.image} />
          </View>
          <View style={styles.detail}>
            <Text style={styles.detailTitle}>{offer ? offer.title : name}</Text>
            {offer &&
              <Text style={styles.detailSubtitle}>
                Oferta válida: {offer.beginDate.toLocaleDateString()}
                - {offer.endDate.toLocaleDateString()}
              </Text>
            }
            <Text style={styles.detailSubtitle}>{descr}</Text>
            {offer && isOfferFreeIncluded(offer) &&
              <FreeIncludedList offerId={offer.id} />
            }
          </View>
          <BrandRelatedHList productId={id} />
          <CondContent
            cond={secureQty > 0}
            defaultText="Existencia 0"
            containerStyle={styles.detail}
          >
            <QtyForm defaultValue={1} max={secureQty} onSubmit={onSubmit} />
          </CondContent>
          <RelatedProductsDialog />
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = (
  state: State,
  { navigation: { state: { params: { productID } } } },
) => {
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
  dispatch,
  { navigation: { state: { params: { productID } } } },
) => ({
  onSubmitWithOffer: (value: number, offerID: string, noNavigate: boolean) =>
    dispatch(postCartProduct(productID, value, offerID, noNavigate)),
});

const mergeProps = (stateProps: Props, dispatchProps: Props, ownProps: Props) => ({
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

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(
  ProductDetailScreen,
);

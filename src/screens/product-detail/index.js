// @flow

import React from 'react';
import { connect } from 'react-redux';
import { Dimensions } from 'react-native';
import { Container, Content, Text, View, Separator, H3 } from 'native-base';

import OptImage from '../../common/components/opt-image';
import QtyForm from '../../common/components/qty-form';
import CondContent from '../../common/components/cond-content';
import {currency, darkGray, defaultEmptyArr} from '../../common/utils/constants';
import type { Product, State, Offer } from '../../common/types';
import { postCartProduct } from '../../ducks/cart';
import { getRelatedProducts } from '../../ducks/products/selectors';
import ProductList from '../home/components/products';
import Visible from '../../common/components/visible';
import {getOfferPrice, isOfferDiscount} from "../../common/utils";

const { width } = Dimensions.get('window');

const styles = {
  image: {
    width: width - 10,
    height: (width - 10) * 1.15,
  },
  priceView: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-end',
    backgroundColor: 'white',
    padding: 10,
  },
  priceReg: {
    backgroundColor: 'white',
    fontSize: 16,
    paddingRight: 10,
    textDecorationLine: 'line-through',
    color: darkGray,
    fontFamily: 'Roboto_regular',
    textAlign: 'right',
  },
  priceCurr: {
    fontSize: 12,
    color: darkGray,
    fontFamily: 'Roboto_regular',
  },
  priceValue: {
    fontSize: 20,
    color: darkGray,
    fontFamily: 'Roboto_regular',
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
  relatedProducts: Product[],
  offer: Offer,
  onSubmit: number => void,
  navigation: { navigate: (string, Object) => void },
};

class ProductDetailScreen extends React.Component<Props> {
  onNavigateProduct = (id: string) => this.props.navigation.navigate('ProductDetail', { productID: id });
  render() {
    const {
      product: { price, name, descr, qty, fileURL },
      offer,
      relatedProducts,
      onSubmit,
    } = this.props;
    const secureQty = parseInt(qty, 10);
    return (
      <Container>
        <Content>
          <View>
            <View style={styles.priceView}>
              <Text style={styles.priceValue}>
                {offer
                  ? getOfferPrice(price, offer)
                  : price
                }
              </Text>
              <Text style={styles.priceCurr}>{currency}</Text>
            </View>
            {offer && isOfferDiscount(offer) &&
              <Text style={styles.priceReg}>{price}</Text>
            }
          </View>
          <View style={styles.center}>
            <OptImage uri={fileURL} size={width} imgStyle={styles.image} />
          </View>
          <View style={styles.detail}>
            <Text style={styles.detailTitle}>{offer ? offer.title : name}</Text>
            <Text style={styles.detailSubtitle}>{descr}</Text>
          </View>
          <CondContent
            cond={secureQty > 0}
            defaultText="Existencia 0"
            containerStyle={styles.detail}
          >
            <QtyForm defaultValue={1} max={secureQty} onSubmit={onSubmit} />
          </CondContent>
          <Separator />
          <Visible enabled={relatedProducts && relatedProducts.length > 0}>
            <View style={styles.detail}>
              <Text style={styles.detailTitle}>Productos complementarios</Text>
            </View>
            <ProductList items={relatedProducts} onNavigate={this.onNavigateProduct} />
          </Visible>
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = (
  state: State,
  { navigation: { state: { params: { productID } } } },
) => {
  const [offerId] = state.offers.rel[productID] || defaultEmptyArr;
  return {
    offer: state.offers.byId[offerId],
    product: state.products.byId[productID],
    relatedProducts: getRelatedProducts(productID, state),
  };
};
const mapDispatchToProps = (
  dispatch,
  { navigation: { state: { params: { productID } } } },
) => ({
  onSubmit: (value: number) => dispatch(postCartProduct(productID, value)),
});
export default connect(mapStateToProps, mapDispatchToProps)(
  ProductDetailScreen,
);

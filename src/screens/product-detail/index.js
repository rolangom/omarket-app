// @flow

import React from 'react';
import { connect } from 'react-redux';
import { Dimensions } from 'react-native';
import { Container, Content, Text, View, Separator, H3 } from 'native-base';

import OptImage from '../../common/components/opt-image';
import QtyForm from '../../common/components/qty-form';
import CondContent from '../../common/components/cond-content';
import { currency, darkGray } from '../../common/utils/constants';
import type { Product, State } from '../../common/types';
import { postCartProduct } from '../../ducks/cart';
import { getRelatedProducts } from '../../ducks/products/selectors';
import ProductList from '../home/components/products';
import Visible from '../../common/components/visible';

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
  onSubmit: number => void,
  navigation: { navigate: (string, Object) => void },
};

class ProductDetailScreen extends React.Component<Props> {
  onNavigateProduct = (id: string) => this.props.navigation.navigate('ProductDetail', { productID: id });
  render() {
    const {
      product: { price, name, descr, qty, fileURL },
      relatedProducts,
      onSubmit,
    } = this.props;
    const secureQty = parseInt(qty, 10);
    return (
      <Container>
        <Content>
          <View style={styles.priceView}>
            <Text style={styles.priceValue}>{price}</Text>
            <Text style={styles.priceCurr}>{currency}</Text>
          </View>
          <View style={styles.center}>
            <OptImage uri={fileURL} size={width} imgStyle={styles.image} />
          </View>
          <View style={styles.detail}>
            <Text style={styles.detailTitle}>{name}</Text>
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
) => ({
  product: state.products.byId[productID],
  relatedProducts: getRelatedProducts(productID, state),
});
const mapDispatchToProps = (
  dispatch,
  { navigation: { state: { params: { productID } } } },
) => ({
  onSubmit: (value: number) => dispatch(postCartProduct(productID, value)),
});
export default connect(mapStateToProps, mapDispatchToProps)(
  ProductDetailScreen,
);

// @flow
import React from 'react';
import { connect } from 'react-redux';
import {
  Container,
  Content,
} from 'native-base';
import type { Product } from '../../common/types';
import Visible from '../../common/components/visible';

import Ads from '../../common/components/ads';
import CategoryList from './components/categories';
import ProductList from './components/products';

import { getProducts } from '../../ducks/products/selectors';


export type Props = {
  parent: string,
  products: Product[],
  navigation: { navigate: (string, Object) => void },
};

class HomeScreen extends React.Component<Props> {
  onNavigate = (id: string) => this.props.navigation.navigate('Browse', { parent: id });
  onNavigateProduct = (id: string) => this.props.navigation.navigate('ProductDetail', { productID: id });
  render() {
    const {
      parent,
      products,
    } = this.props;
    return (
      <Container>
        <Content>
          <Visible enabled={products.length === 0}>
            <Ads forceLoad={!parent} />
          </Visible>
          <CategoryList
            parent={parent}
            onNavigate={this.onNavigate}
          />
          <ProductList
            items={products}
            onNavigate={this.onNavigateProduct}
          />
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = (state, props) => {
  const parent = props.navigation.state
    && props.navigation.state.params
    && props.navigation.state.params.parent;
  return {
    parent,
    products: getProducts(state, parent),
  };
};
export default connect(mapStateToProps)(HomeScreen);

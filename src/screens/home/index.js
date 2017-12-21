// @flow
import React from 'react';
import { connect } from 'react-redux';
// import { NavigationNavigatorProps } from 'react-navigation/src/TypeDefinition';
import {
  Container,
  Header,
  Content,
  Left,
  Body,
  Right,
  Title,
  Text,
  Button,
  Icon,
} from 'native-base';
import type { Category, Product } from '../../config/types';

import Ads from '../../common/components/ads';
import CategoryList from './components/categories';
import ProductList from './components/products';

import { getCategories } from './components/categories/selectors';
import { getProducts } from './components/products/selectors';


export type Props = {
  parent: string,
  categories: Category[],
  products: Product[],
  onNavigate: (string) => void,
  onNavigateProduct: (string) => void,
  loadCategories: () => void,
  loadProducts: () => void,
};

class HomeScreen extends React.Component<Props> {
  render() {
    const {
      parent,
      categories,
      products,
      onNavigate,
      onNavigateProduct,
    } = this.props;
    return (
      <Container>
        <Content>
          <Ads
            visible={products.length === 0}
            forceLoad={!parent}
          />
          <CategoryList
            parent={parent}
            onNavigate={onNavigate}
            items={categories}
          />
          <ProductList
            items={products}
            onNavigate={onNavigateProduct}
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
    categories: getCategories(state, parent),
    products: getProducts(state, parent),
  };
};
const mapDispatchToProps = (dispatch, props) => {
  return {
    onNavigate: (id: string) => props.navigation.navigate('Home', { parent: id }),
    onNavigateProduct: (id: string) => { }, // props.navigation.navigate('ProductDetail', { parent: id }),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);

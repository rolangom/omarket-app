// @flow
import React from 'react';
import { connect } from 'react-redux';
import { Container, Content } from 'native-base';
import type { Product } from 'src/common/types';

import Ads from 'src/common/components/ads';
import CategoryList from './components/categories';
import ProductList from './components/products';
import Greeting from './components/greeting';
// import Filters from './components/filters';
import SearchButton from './components/search/button';

import { getProducts } from 'src/ducks/products/selectors';
import { isFilterActive as getIsFilterActive } from 'src/ducks/global/selectors';

export type Props = {
  parent: string,
  products: Product[],
  isFilterActive: boolean,
  navigation: {
    navigate(string, Object): void,
    push(string, Object): void,
  },
};

class HomeScreen extends React.Component<Props> {
  onNavigate = (id: string) =>
    this.props.navigation.push('Browse', { parent: id });
  onNavigateProduct = (id: string) =>
    this.props.navigation.navigate('ProductDetail', { productID: id });
  render() {
    const { parent, products, isFilterActive } = this.props;
    return (
      <Container>
        <SearchButton />
        <Content>
          <Greeting enabled={!parent} />
          <Ads
            visible={products.length === 0}
            forceLoad={!parent}
          />
          {/*{!parent && <Filters />}*/}
          <CategoryList
            visible={!isFilterActive}
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
  const parent =
    props.navigation.state &&
    props.navigation.state.params &&
    props.navigation.state.params.parent;
  return {
    parent,
    products: getProducts(state, parent),
    isFilterActive: getIsFilterActive(state),
  };
};
export default connect(mapStateToProps)(HomeScreen);

// @flow
import React from 'react';
import { connect } from 'react-redux';
import { Container, Content } from 'native-base';
import type { Product } from '../../common/types';
import Visible from '../../common/components/visible';

import Ads from '../../common/components/ads';
import CategoryList from './components/categories';
import ProductList from './components/products';
import Greeting from './components/greeting';
// import Filters from './components/filters';
import SearchButton from './components/search/button';

import { getProducts } from '../../ducks/products/selectors';
import { isFilterActive as getIsFilterActive } from '../../ducks/global/selectors';

export type Props = {
  parent: string,
  products: Product[],
  isFilterActive: boolean,
  navigation: { navigate: (string, Object) => void },
};

class HomeScreen extends React.Component<Props> {
  onNavigate = (id: string) =>
    this.props.navigation.navigate('Browse', { parent: id });
  onNavigateProduct = (id: string) =>
    this.props.navigation.navigate('ProductDetail', { productID: id });
  onNavigateSearch = () => this.props.navigation.navigate('Search');
  render() {
    const { parent, products, isFilterActive } = this.props;
    return (
      <Container>
        <Content>
          <SearchButton onPress={this.onNavigateSearch} />
          <Greeting enabled={!parent} />
          <Visible enabled={products.length === 0}>
            <Ads forceLoad={!parent} />
          </Visible>
          {/*{!parent && <Filters />}*/}
          {!isFilterActive && (
            <CategoryList parent={parent} onNavigate={this.onNavigate} />
          )}
          <ProductList items={products} onNavigate={this.onNavigateProduct} />
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

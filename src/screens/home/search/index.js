// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { Container, Body, Content, Header } from 'native-base';
import Search from '../components/search';
import type { Category, Product, State } from '../../../common/types';
import SearchItemsResult from './components/items';
import { setFilters } from '../../../ducks/global';
import { defaultEmptyArr } from '../../../common/utils/constants';

type Props = {
  navigation: { navigate: (string, Object) => void, goBack: (?string) => void },
  searchTerm: ?string,
  onChange: string => void,
  categories: Category[],
  products: Product[],
};

type CompState = {
  searchTerm: string,
};

class SearchScreen extends React.Component<Props, CompState> {
  state = { searchTerm: this.props.searchTerm };
  onNavigate = (id: string) =>
    this.props.navigation.navigate('Browse', { parent: id });
  onNavigateProduct = (id: string) =>
    this.props.navigation.navigate('ProductDetail', { productID: id });
  onChange = (searchTerm: string) => {
    this.setState(() => ({ searchTerm }));
    this.props.onChange(searchTerm);
  };
  onClearAndClose = () => {
    this.onChange('');
    this.props.navigation.goBack();
  };
  render() {
    const { categories, products } = this.props;
    const { searchTerm } = this.state;
    return (
      <Container>
        <Header>
          <Body>
            <Search
              closeButton
              searchTerm={searchTerm}
              onChangeText={this.onChange}
              onClosePress={this.onClearAndClose}
            />
          </Body>
        </Header>
        <Content>
          <SearchItemsResult
            title="Categorías:"
            items={categories}
            onNavigate={this.onNavigate}
          />
          <SearchItemsResult
            title="Productos:"
            items={products}
            onNavigate={this.onNavigateProduct}
          />
        </Content>
      </Container>
    );
  }
}

SearchScreen.navigationOptions = {
  header: null,
};

const mapStateToProps = (state: State) => {
  const { searchTerm = '' } = state.global.filters;
  const nsearchTerm = searchTerm.toLocaleLowerCase();
  return {
    searchTerm,
    categories:
      searchTerm && searchTerm.length > 0
        ? Object.values(state.categories.byId)
            .filter((it: Category) =>
              it.name.toLocaleLowerCase().startsWith(nsearchTerm),
            )
            .slice(0, 3)
        : defaultEmptyArr,
    products:
      searchTerm && searchTerm.length > 0
        ? Object.values(state.products.byId)
            .filter(
              (it: Product) =>
                it.name.toLocaleLowerCase().startsWith(nsearchTerm) ||
                it.descr.toLocaleString().includes(nsearchTerm) ||
                (it.usefulAs &&
                  it.usefulAs.some((_it: string) =>
                    _it.toLocaleLowerCase().startsWith(nsearchTerm),
                  )) ||
                (it.contents &&
                  it.contents.some((_it: string) =>
                    _it.toLocaleLowerCase().startsWith(nsearchTerm),
                  )),
            )
            .slice(0, 3)
        : defaultEmptyArr,
  };
};

const mapDispatchToProps = dispatch => ({
  onChange: (value: string) => dispatch(setFilters('searchTerm', value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchScreen);

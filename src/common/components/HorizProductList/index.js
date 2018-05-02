// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import { FlatList } from 'react-native';
import { View, Text } from 'native-base';
import { getRelatedProducts } from '../../../ducks/products/selectors';
import type { Product, State } from '../../types';
import Item from './Item';

export type Props = {
  productId: string,
  items: Product[],
  onNavigate: string => void,
  navigation: { navigate: (string, Object) => void },
};

export type ItemProps = {
  item: Product,
  index: number,
};

const styles = {
  view: {
    backgroundColor: 'white',
  },
  text: {
    paddingHorizontal: 10,
  },
};

class HorizProductList extends React.Component<Props> {
  onNavigateProduct = (id: string) =>
    this.props.navigation.navigate('ProductDetail', { productID: id });
  keyExtractor = (item: Product) => item.id;
  renderItem = ({ item }: ItemProps) => (
    <Item
      key={item.id}
      item={item}
      onPress={this.onNavigateProduct}
    />
  );
  render() {
    const { items } = this.props;
    return (
      items.length > 0
        ? (
          <View style={styles.view}>
            <Text style={styles.text}>También te podría interesar:</Text>
            <FlatList
              horizontal
              data={this.props.items}
              renderItem={this.renderItem}
              keyExtractor={this.keyExtractor}
            />
          </View>
        )
        : null
    );
  }
}

export default withNavigation(connect((state: State, { productId }: Props) => ({
  items: productId
    ? getRelatedProducts(productId, state)
    : [],
}))(HorizProductList));

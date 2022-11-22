// @flow

import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import ProductListItem from './list-item';
import type { Product } from 'src/common/types';

export type Props = {
  items: Product[],
  addButton?: boolean,
  navigation: { navigate(string, Object): void },
};

export type ItemProps = {
  item: Product,
  index: number,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

class ProductList extends React.Component<Props> {
  keyExtractor = (item: Product): string => item.id;
  renderItem = ({ item }: ItemProps) => (
    <ProductListItem
      key={item.id}
      item={item}
      addButton={this.props.addButton}
    />
  );
  render() {
    const { items } = this.props;
    return (
      <View style={styles.container}>
        <FlatList
          data={items}
          numColumns={2}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
        />
      </View>
    );
  }
}

ProductList.defaultProps = {
  addButton: false,
};

export default ProductList;

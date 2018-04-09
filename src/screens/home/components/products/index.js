// @flow

import React from 'react';
import { View, FlatList } from 'react-native';
import ProductListItem from './list-item';
import type { Product } from '../../../../common/types';

export type Props = {
  items: Product[],
  onNavigate: (string) => void,
};

export type ItemProps = {
  item: Product,
  index: number,
};

const styles = {
  container: {
    flex: 1,
  },
};

class ProductList extends React.Component<Props> {
  keyExtractor = (item: Product) => item.id;
  renderItem = ({ item }: ItemProps) => (
    <ProductListItem
      id={item.id}
      key={item.id}
      value={item.id}
      title={item.name}
      descr={item.descr}
      price={item.price}
      qty={item.qty}
      imgURL={item.fileURL}
      onPress={this.props.onNavigate}
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

export default ProductList;

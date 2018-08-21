// @flow
import * as React from 'react';
import { FlatList } from 'react-native';
import { withNavigation } from 'react-navigation';
import { View, Text } from 'native-base';
import Item from './Item';
import type { Product } from '../../types';

type Props = {
  items: Product[],
  title: string,
  navigation: Object,
}

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


class HProdList extends React.Component<Props> {
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
    const { items, title } = this.props;
    return (
      items.length > 0
        ? (
          <View style={styles.view}>
            <Text style={styles.text}>{title}</Text>
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

export default withNavigation(HProdList);

import React from 'react';
import { List } from 'native-base';
import CategoryListItem from './list-item';
import type { Category } from '../../../../config/types';

export type Props = {
  items: Category[],
  onNavigate: (string) => void,
}

class CategoryList extends React.Component<Props> {
  renderItem = (item: Category) => (
    <CategoryListItem
      key={item.id}
      title={item.name}
      value={item.id}
      imgURL={item.fileURL}
      onPress={this.props.onNavigate}
    />
  );
  render() {
    const { items } = this.props;
    return (
      <List
        dataArray={items}
        renderRow={this.renderItem}
      />
    );
  }
}

export default CategoryList;

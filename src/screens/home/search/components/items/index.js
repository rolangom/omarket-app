// @flow
import * as React from 'react';
import { withNavigation } from 'react-navigation';
import { List, ListItem, Text } from 'native-base';
import type { Category, Product } from '../../../../../common/types';
import CategoryListItem from '../../../components/categories/list-item';

type Props = {
  onNavigate: (string) => void,
  title: string,
  items: Category[] | Product[],
};


class SearchItemsResult extends React.Component<Props> {
  renderItem = (it: Category | Product) => (
    <CategoryListItem
      key={it.id}
      title={it.name}
      value={it.id}
      imgURL={it.fileURL}
      onPress={this.props.onNavigate}
    />
  );
  render() {
    const { title, items } = this.props;
    return items.length > 0 ? (
      <List>
        <ListItem itemDivider>
          <Text>{title}</Text>
        </ListItem>
        {items.map(this.renderItem)}
      </List>
    ) : null;
  }
}

export default withNavigation(SearchItemsResult);

// @flow
import * as React from 'react';
import { branch, renderNothing, compose, withHandlers } from 'recompose';
import { List, ListItem, Text } from 'native-base';
import type { Category, Product } from 'src/common/types';
import CategoryListItem from 'src/screens/home/components/categories/list-item';

type Props = {
  onNavigate: (string) => void,
  title: string,
  items: Category[] | Product[],
  renderItem(Category[] | Product[]): React.Node<*>,
};

const SearchItemsResult = (props: Props) => (
  <List>
    <ListItem itemDivider>
      <Text>{props.title}</Text>
    </ListItem>
    {props.items.map(props.renderItem)}
  </List>
);

const enhance = compose(
  branch(
    (props: Props) => props.items.length === 0,
    renderNothing,
  ),
  withHandlers({
    renderItem: (props: Props) => (it: Category | Product) => (
      <CategoryListItem
        key={it.id}
        title={it.name}
        value={it.id}
        imgURL={it.fileURL}
        onPress={props.onNavigate}
      />
    ),
  }),
);

export default enhance(SearchItemsResult);


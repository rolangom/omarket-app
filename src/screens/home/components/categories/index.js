// @flow
import React from 'react';
import { connect } from 'react-redux';
import { List } from 'native-base';
import CategoryListItem from './list-item';
import type { Category, State } from '../../../../common/types';
import { getCategories } from '../../../../ducks/categories/selectors';
import { visibleIf } from '../../../../common/components/visible';

export type Props = {
  items: Category[],
  onNavigate: string => void,
};

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
    return <List dataArray={items} renderRow={this.renderItem} />;
  }
}

const mapStateToProps = (state: State, props: Props) => ({
  items: getCategories(state, props.parent),
});
export default connect(mapStateToProps)(visibleIf(CategoryList));

// @flow
import React from 'react';
import { connect } from 'react-redux';
import { List, Text, View } from 'native-base';
import CategoryListItem from './list-item';
import type { Category, State } from '../../../../common/types';
import { getCategories } from '../../../../ducks/categories/selectors';
import Visible from '../../../../common/components/visible';

export type Props = {
  items: Category[],
  onNavigate: (string) => void,
  parent: ?string,
  userName: ?string,
};

const styles = {
  greeting: {
    padding: 5,
    textAlign: 'right',
  },
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
    const { items, parent, userName } = this.props;
    return (
      <View>
        <Visible enabled={!parent && userName}>
          <Text style={styles.greeting}>Saludos {userName}</Text>
        </Visible>
        <List
          dataArray={items}
          renderRow={this.renderItem}
        />
      </View>
    );
  }
}

const mapStateToProps = (state: State, props: Props) => ({
  userName: state.user && state.user.displayName,
  items: getCategories(state, props.parent),
});
export default connect(mapStateToProps)(CategoryList);


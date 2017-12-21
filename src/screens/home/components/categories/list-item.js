// @flow
import React from 'react';
import {
  ListItem,
  View,
  Text,
  Left,
  Body,
  Right,
  Icon,
  Thumbnail,
  H3,
} from 'native-base';

import OptThumbnail from '../../../../common/components/opt-thumbnail';

export type Props = {
  imgURL?: ?string,
  title: string,
  value: any,
  onPress: (any) => void,
};

const styles = {
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    height: 45,
  },
  text: {
    color: 'gray',
    textAlign: 'center',
  },
  image: {
    height: 45,
    width: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
};

export default class CategoryListItem extends React.Component<Props> {
  onPress = () =>
    this.props.onPress &&
    this.props.value &&
    this.props.onPress(this.props.value);

  render() {
    const { title, imgURL } = this.props;
    return (
      <ListItem
        button
        thumbnail
        onPress={this.onPress}
      >
        <OptThumbnail
          uri={imgURL}
          resizeMode="cover"
          size={45}
          square
          style={styles.image}
        />
        <Body>
          <Text style={styles.text}>{title}</Text>
        </Body>
        <Right>
          <Icon name="ios-arrow-forward" />
        </Right>
      </ListItem>
    );
  }
}


// @flow
import React from 'react';
import { Dimensions, TouchableOpacity } from 'react-native';
import OptImage from '../opt-image';
import type { Product } from '../../types';

const { width } = Dimensions.get('window');
const size = width * 0.25 - 4;

type Props = {
  item: Product,
  onPress: (string) => void,
};

const styles = {
  imgStyle: {
    height: size,
    width: size,
    margin: 2,
  },
};

class Item extends React.Component<Props> {
  onPress = () => this.props.onPress(this.props.item.id);
  render() {
    const { item } = this.props;
    return (
      <TouchableOpacity onPress={this.onPress}>
        <OptImage
          key={item.id}
          uri={item.fileURL}
          size={size}
          imgStyle={styles.imgStyle}
        />
      </TouchableOpacity>
    );
  }
}

export default Item;

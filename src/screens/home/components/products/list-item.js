import React from 'react';
import { View, Dimensions, TouchableOpacity } from 'react-native';
import { Text } from 'native-base';
import OptImage from '../../../../common/components/opt-image';
import { getPriceWithCurrency } from '../../../../utils';
import {darkGray, lighterGray} from '../../../../config/constants';

export type Props = {
  value: any,
  title: string,
  descr: string,
  imgURL?: ?string,
  price: number,
  qty: number,
  onPress: (string) => void,
};

const { width } = Dimensions.get('window');
const size = (width * 0.5) - 4;

const styles = {
  container: {
    backgroundColor: 'white',
    margin: 2,
    paddingBottom: 10,
  },
  item: {
    flexDirection: 'column',
  },
  content: {
    backgroundColor: lighterGray,
    padding: 5,
  },
  row: {
    flexDirection: 'row',
  },
  imgStyle: {
    width: size,
    height: size * 1.15,
  },
  title: {
    fontSize: 12,
    flex: 1,
    fontFamily: 'Roboto_regular',
    color: darkGray,
  },
  subtitle: {
    fontFamily: 'Roboto_regular',
    fontSize: 10,
    color: darkGray,
  },
  price: {
    fontFamily: 'Roboto_regular',
    fontSize: 10,
    color: darkGray,
  },
};

class ProductListItem extends React.Component<Props> {
  onPress = () => this.props.onPress(this.props.value);
  render() {
    const {
      title,
      descr,
      imgURL,
      price,
    } = this.props;
    return (
      <TouchableOpacity
        onPress={this.onPress}
        style={styles.container}
      >
        <View style={styles.item}>
          <OptImage
            uri={imgURL}
            size={size}
            imgStyle={styles.imgStyle}
          />
          <View style={styles.content}>
            <View style={styles.row}>
              <Text
                style={styles.title}
                numberOfLines={1}
              >
                {title}
              </Text>
              <Text style={styles.price}>{getPriceWithCurrency(price)}</Text>
            </View>
            <Text
              style={styles.subtitle}
              numberOfLines={2}
              note
            >
              {descr}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

export default ProductListItem;

import * as React from 'react';
import { connect } from 'react-redux';
import { View, Dimensions, TouchableOpacity } from 'react-native';
import { Text } from 'native-base';
import OptImage from '../../../../common/components/opt-image';
import {
  getOfferPrice,
  getPriceWithCurrency,
  isOfferDiscount,
} from '../../../../common/utils';
import {
  darkGray,
  lighterGray,
  defaultEmptyArr,
} from '../../../../common/utils/constants';
import type { Offer, State } from '../../../../common/types';

export type Props = {
  id: string,
  value: any,
  title: string,
  descr: string,
  imgURL?: ?string,
  price: number,
  qty: number,
  onPress: string => void,
  offer?: ?Offer,
};

const { width } = Dimensions.get('window');
const size = width * 0.5 - 4;

const styles = {
  container: {
    backgroundColor: 'white',
    margin: 2,
    paddingBottom: 10,
  },
  item: {
    flexDirection: 'column',
    width: size,
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
  priceReg: {
    fontFamily: 'Roboto_regular',
    fontSize: 8,
    color: darkGray,
    textDecorationLine: 'line-through',
  },
};

class ProductListItem extends React.Component<Props> {
  onPress = () => this.props.onPress(this.props.value);
  render() {
    const { title, descr, imgURL, price, offer } = this.props;
    console.log('Product ', title, offer);
    return (
      <TouchableOpacity onPress={this.onPress} style={styles.container}>
        <View style={styles.item}>
          <OptImage uri={imgURL} size={size} imgStyle={styles.imgStyle} />
          <View style={styles.content}>
            <View style={styles.row}>
              <Text style={styles.title} numberOfLines={1}>
                {offer ? offer.title : title}
              </Text>
              <View>
                <Text style={styles.price}>
                  {getPriceWithCurrency(
                    offer ? getOfferPrice(price, offer) : price,
                  )}
                </Text>
                {offer &&
                  isOfferDiscount(offer) && (
                    <Text style={styles.priceReg}>
                      {getPriceWithCurrency(price)}
                    </Text>
                  )}
              </View>
            </View>
            <Text style={styles.subtitle} numberOfLines={2} note>
              {descr}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const mapStateToProps = (state: State, { id }: Props) => {
  const [offerId] = state.offers.rel[id] || defaultEmptyArr;
  return {
    offer: state.offers.byId[offerId],
  };
};

export default connect(mapStateToProps)(ProductListItem);

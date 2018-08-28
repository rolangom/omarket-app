// @flow
import * as React from 'react';
import { withNavigation } from 'react-navigation';
import { connect } from 'react-redux';
import { View, Dimensions, TouchableOpacity } from 'react-native';
import { Text, Button } from 'native-base';
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
import { incrCartProduct } from '../../../../ducks/cart';
import { setShowRelatedProdId } from '../../../../ducks/global';

export type Props = {
  id: string,
  value: any,
  title: string,
  descr: string,
  imgURL?: ?string,
  price: number,
  qty: number,
  onPress: string => void,
  add1ToCart: () => void,
  offer?: ?Offer,
  addButton: boolean,
  navigation: { navigate(string, Object): void },
  hideRelatedProductIdModal(): void,
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
    fontWeight: 'bold',
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
  addButton: {
    position: 'absolute',
    right: 0,
    top: size * 1.15 - 30,
  },
};

class ProductListItem extends React.Component<Props> {
  onNavigateProduct = () => {
    this.props.navigation.navigate('ProductDetail', {
      productID: this.props.id,
    });
    this.props.hideRelatedProductIdModal();
  };
  render() {
    const {
      title,
      descr,
      imgURL,
      price,
      offer,
      addButton,
      add1ToCart,
    } = this.props;
    console.log('Product ', title, offer);
    return (
      <TouchableOpacity
        onPress={this.onNavigateProduct}
        style={styles.container}
      >
        <View style={styles.item}>
          <OptImage uri={imgURL} size={size} imgStyle={styles.imgStyle} />
          {addButton && (
            <Button
              style={styles.addButton}
              bordered
              small
              onPress={add1ToCart}
            >
              <Text>+1</Text>
            </Button>
          )}
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

const mapDispatchToProps = (dispatch, props: Props) => ({
  hideRelatedProductIdModal: () => dispatch(setShowRelatedProdId(false)),
  add1ToCart: (offer: Offer) =>
    dispatch(incrCartProduct(props.id, offer && offer.id)),
});

const mergeProps = (statePros, dispatchProps, ownProps) => ({
  ...statePros,
  ...dispatchProps,
  ...ownProps,
  add1ToCart: () => dispatchProps.add1ToCart(statePros.offer),
});
export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(
  withNavigation(ProductListItem),
);

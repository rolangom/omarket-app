// @flow

import React from 'react';
import { connect } from 'react-redux';
import { Dimensions } from 'react-native';
import {
  Container,
  Content,
  Text,
  View,
  Footer
} from 'native-base';

import OptImage from '../../common/components/opt-image';
import QtyForm from '../../common/components/qty-form';
import { currency, darkGray } from '../../config/constants';
import type { Product, State } from '../../config/types';

const { width } = Dimensions.get('window');

const styles = {
  image: {
    width: width - 10,
    height: (width - 10) * 1.15,
  },
  priceView: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-end',
    backgroundColor: 'white',
    padding: 10,
  },
  priceCurr: {
    fontSize: 12,
    color: darkGray,
    fontFamily: 'Roboto_regular',
  },
  priceValue: {
    fontSize: 20,
    color: darkGray,
    fontFamily: 'Roboto_regular',
  },
  detail: {
    padding: 10,
    backgroundColor: 'white',
  },
  detailTitle: {
    fontSize: 16,
    color: darkGray,
    fontFamily: 'Roboto_regular',
  },
  detailSubtitle: {
    fontSize: 12,
    color: darkGray,
    fontFamily: 'Roboto_regular',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
};

export type Props = {
  product: Product,
  onSubmit: (number) => void,
};

class ProductDetailScreen extends React.Component<Props> {
  render() {
    const {
      product: {
        price,
        name,
        descr,
        qty,
        fileURL,
      },
      onSubmit,
    } = this.props;
    return (
      <Container>
        <Content>
          <View style={styles.priceView}>
            <Text style={styles.priceValue}>{price}</Text>
            <Text style={styles.priceCurr}>{currency}</Text>
          </View>
          <View style={styles.center}>
            <OptImage
              uri={fileURL}
              size={width}
              imgStyle={styles.image}
            />
          </View>
          <View style={styles.detail}>
            <Text style={styles.detailTitle}>{name}</Text>
            <Text style={styles.detailSubtitle}>{descr}</Text>
          </View>
          <QtyForm
            defaultValue={0}
            max={parseInt(qty)}
            onSubmit={onSubmit}
          />
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = (state: State, { navigation: { state: { params: { productID } } } }) => ({
  product: state.products.find((it: Product) => it.id === productID),
});
const mapDispatchToProps = (dispatch) => ({
  onSubmit: (value: number) => {},
});
export default connect(mapStateToProps, mapDispatchToProps)(ProductDetailScreen);

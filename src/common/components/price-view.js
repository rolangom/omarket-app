// @flow
import React from 'react';
import { View, Text } from 'native-base';
import {
  currency as defaultCurrency,
  darkGray,
  lighterGray,
  darkerGray,
} from '../utils/constants';


export type Props = {
  value: number,
  title: string,
  currency: string,
  isTotal: boolean,
};

const styles = {
  priceView: {
    flexDirection: 'row-reverse',
    padding: 5,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    // backgroundColor: lighterGray,
    // padding: 10,
    // borderRadius: 5,
  },
  large: {
    fontSize: 22,
    color: darkerGray,
    fontFamily: 'Roboto_regular',
  },
  small: {
    fontSize: 16,
    color: darkGray,
    fontFamily: 'Roboto_regular',
  },
};

const PriceView = ({ value, title, currency, isTotal }: Props) => (
  <View style={styles.priceView}>
    <View style={styles.priceContainer}>
      <Text style={isTotal ? styles.large : styles.small}>{title}</Text>
      <Text style={isTotal ? styles.large : styles.small}>{currency}{value.toFixed(2)}</Text>
    </View>
  </View>
);

PriceView.dafaultProps = {
  value: 0,
  currency: defaultCurrency,
};

export default PriceView;

// @flow
import React from 'react';
import { View, Text } from 'native-base';
import {
  currency as defaultCurrency,
  darkGray,
  lighterGray,
} from '../utils/constants';
import { visibleIf } from './visible';

export type Props = {
  value: number,
  currency: string,
};

const styles = {
  priceView: {
    flexDirection: 'row-reverse',
    padding: 5,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: lighterGray,
    padding: 10,
    borderRadius: 5,
  },
  priceCurr: {
    fontSize: 20,
    color: darkGray,
    fontFamily: 'Roboto_regular',
  },
  priceValue: {
    fontSize: 32,
    color: darkGray,
    fontFamily: 'Roboto_regular',
  },
};

const PriceView = ({ value, currency }: Props) => (
  <View style={styles.priceView}>
    <View style={styles.priceContainer}>
      <Text style={styles.priceCurr}>{currency} </Text>
      <Text style={styles.priceValue}>{value.toFixed(2)}</Text>
    </View>
  </View>
);

PriceView.dafaultProps = {
  value: 0,
  currency: defaultCurrency,
};

export const CondPriceView = visibleIf(PriceView);
export default PriceView;

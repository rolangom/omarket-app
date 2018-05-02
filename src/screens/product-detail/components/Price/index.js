// @flow
import * as React from 'react';
import { View, Text } from 'native-base';
import { currency, darkGray } from '../../../../common/utils/constants';

const styles = {
  priceView: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-end',
    backgroundColor: 'white',
    padding: 10,
  },
  priceReg: {
    backgroundColor: 'white',
    fontSize: 16,
    textDecorationLine: 'line-through',
    color: darkGray,
    fontFamily: 'Roboto_regular',
    textAlign: 'right',
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
};

type Props = {
  amount: number,
  isSub?: boolean,
};

const Price = ({ amount, isSub }: Props) => (
  <View style={styles.priceView}>
    <Text style={isSub ? styles.priceReg : styles.priceValue}>
      {amount}
    </Text>
    <Text style={styles.priceCurr}>{currency}</Text>
  </View>
);

Price.defaultProps = {
  isSub: false,
};

export default Price;

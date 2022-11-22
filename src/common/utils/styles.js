// @flow
import { Dimensions, StyleSheet } from 'react-native';
import {red, gray, darkGray} from './constants';

export const {
  width: deviceWidth,
  height: deviceHeight,
} = Dimensions.get('window');

export const {
  padS,
  padM,
  padL,
  padXL,
  padXXL,
  padXS,
} = {
  padXS: 2,
  padS: 5,
  padM: 10,
  padL: 15,
  padXL: 20,
  padXXL: 25,
};

const styles = StyleSheet.create({
  grayText: {
    color: gray,
  },
  redText: {
    color: red,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerText: {
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  flex1: {
    flex: 1,
  },
  paddingM: {
    padding: padM,
  },
  priceReg: {
    backgroundColor: 'white',
    fontSize: 8,
    textDecorationLine: 'line-through',
    color: darkGray,
    fontFamily: 'Roboto_regular',
  },
});

export const {
  grayText,
  redText,
  priceReg,
  centered,
  row,
  flex1,
  paddingM,
  centerText,
} = styles;

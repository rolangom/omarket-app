// @flow
import * as React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { darkGray } from '../utils/constants';
// import Ionicons from 'react-native-vector-icons/dist/Ionicons';

type Props = {
  isUp?: boolean
};

const Chevron = ({ isUp }: Props) => (
  <Ionicons
    size={24}
    color={darkGray}
    name={isUp ? 'ios-arrow-up' : 'ios-arrow-down'}
  />
);

Chevron.defaultProps = {
  isUp: false,
};

export default Chevron;

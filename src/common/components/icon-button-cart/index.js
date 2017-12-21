// @flow
import React from 'react';
// import { withNavigation } from 'react-navigation';
import {
  Button,
  Icon,
  View,
  Badge,
} from 'native-base';
import { darkGray } from '../../../config/constants';

export type Props = {
  onNavigate: () => void,
};

const IconButtonCart = ({ onNavigate }: Props) => (
  <Button
    transparent
    onPress={onNavigate}
  >
    <Icon
      name="ios-cart-outline"
      style={{ color: darkGray }}
    />
  </Button>
);

export default IconButtonCart;

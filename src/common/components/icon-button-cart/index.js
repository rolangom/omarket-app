// @flow
import React from 'react';
// import { withNavigation } from 'react-navigation';
import {
  Button,
  Icon,
  View,
  Badge,
} from 'native-base';

export type Props = {
  onNavigate: () => void,
};

const IconButtonCart = ({ onNavigate }: Props) => (
  <Button
    transparent
    onPress={onNavigate}
  >
    <Icon name="md-cart" />
  </Button>
);

export default IconButtonCart;

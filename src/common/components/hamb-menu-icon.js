// @flow

import React from 'react';
import {
  Button,
  Icon,
} from 'native-base';
import { darkGray } from '../../config/constants';


const styles = {
  badge: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  icon: {
    color: darkGray,
  },
};

export type Props = {
  onPress: () => void
};

const HambMenuIcon = ({ onPress }) => (
  <Button
    transparent
    onPress={onPress}
  >
    <Icon
      name="ios-menu"
      style={styles.icon}
    />
  </Button>
);

export default HambMenuIcon;

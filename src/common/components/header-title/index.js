import React from 'react';
import { Image } from 'react-native';

const styles = {
  width: 154,
  height: 33,
};

const HeaderTitle = () =>
  <Image source={require('./header.png')} style={styles} />;

export default HeaderTitle;

// @flow
import React from 'react';
import { Image, View, StyleSheet } from 'react-native';
import { Icon } from 'native-base';

import { lightGray } from '../../utils/constants';

export type Props = {
  uri: string,
  resizeMode: string,
  size?: number,
  imgStyle: {
    width: number,
    height: number,
  },
};

const styles = StyleSheet.create({
  view: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
});

const getDefaultImgStyle = (size: number) => ({ width: size, height: size * 1.15 });

const OptImage = ({ uri, size, resizeMode, imgStyle = getDefaultImgStyle(size) }: Props) => (
  <View style={[styles.view, imgStyle]}>
    {uri ?
      <Image
        source={{ uri }}
        resizeMode={resizeMode}
        style={imgStyle}
      />
      :
      <Icon
        name="ios-image"
        color={lightGray}
        style={{ fontSize: size, color: lightGray }}
      />
    }
  </View>
);

OptImage.defaultProps = {
  size: 24,
  resizeMode: 'cover',
};

export default OptImage;

// @flow
import React from 'react';
import { Image, View } from 'react-native';
import { Icon } from 'native-base';

import { lightGray } from '../../../config/constants';

export type Props = {
  uri: string,
  size: number,
  imgStyle: {
    width: number,
    height: number,
  },
};

const styles = {
  view: {
    alignItems: 'center',
    justifyContent: 'center',
  },
};

const OptImage = ({ uri, size, imgStyle }: Props) => (
  <View style={[styles.view, imgStyle]}>
    {uri ?
      <Image
        source={{ uri }}
        resizeMode="cover"
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

export default OptImage;

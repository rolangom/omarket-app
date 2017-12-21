// @flow
import React from 'react';
import { Image, View } from 'react-native';
import { Icon } from 'native-base';

import { lighterGray } from '../../../config/constants';

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
        color={lighterGray}
        style={{ fontSize: size, color: lighterGray }}
      />
    }
  </View>
);

export default OptImage;

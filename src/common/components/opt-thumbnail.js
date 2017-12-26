// @flow
import React from 'react';
import { Thumbnail, View } from 'native-base';
import DummyView from './dummy-view';
import { lightGray } from '../utils/constants';

export type Props = {
  square?: boolean,
  size?: number,
  uri: string,
  borderless?: boolean,
};

const styles = {
  main: {
    borderColor: lightGray,
    borderWidth: 2,
  },
};

const OptThumbnail = ({
  square,
  size,
  uri,
  borderless,
  ...args
}: Props) => (
  uri ?
    <View style={borderless ? null : styles.main}>
      <Thumbnail
        square={square}
        size={size}
        source={{ uri }}
        {...args}
      />
    </View>
    :
    <DummyView size={size} />
);

OptThumbnail.defaultProps = {
  square: false,
  size: 45,
  borderless: false,
};

export default OptThumbnail;

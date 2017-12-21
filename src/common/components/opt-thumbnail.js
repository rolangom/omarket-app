// @flow
import React from 'react';
import { Thumbnail, View } from 'native-base';
import DummyView from './dummy-view';
import { lightGray } from '../../config/constants';

export type Props = {
  square?: boolean,
  size?: number,
  uri: string,
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
  ...args
}: Props) => (
  uri ?
    <View style={styles.main}>
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


export default OptThumbnail;

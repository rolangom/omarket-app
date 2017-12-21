// @flow
import React from 'react';
import { Thumbnail } from 'native-base';
import DummyView from './dummy-view'

export type Props = {
  square?: boolean,
  size?: number,
  uri: string,
};

const OptThumbnail = ({ square, size, uri, ...args }: Props) => (
  uri ?
    <Thumbnail
      square={square}
      size={size}
      source={{ uri }}
      {...args}
    /> :
    <DummyView size={size} />
);


export default OptThumbnail;

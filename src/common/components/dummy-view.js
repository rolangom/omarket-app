import React from 'react';
import { View } from 'react-native';

export type Props = {
  size: number,
};

const DummyView = ({ size }: Props) => (
  <View
    style={{
      width: size,
      height: size,
    }}
  />
);

export default DummyView;

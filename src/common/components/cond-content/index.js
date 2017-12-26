// @flow
import React from 'react';
import { Text, View } from 'native-base';

export type Props = {
  cond: boolean,
  defaultText: string,
  containerStyle?: any,
  children: React.Node<*>,
};

const CondContent = ({
  cond,
  defaultText,
  containerStyle,
  children,
}: Props) => (
  cond ?
    children :
    <View style={containerStyle}>
      <Text>{defaultText}</Text>
    </View>
);

CondContent.defaultProps = {
  containerStyle: {},
};

export default CondContent;

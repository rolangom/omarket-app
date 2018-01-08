// @flow
import React from 'react';
import { Text, View } from 'native-base';

export type Props = {
  cond: boolean,
  defaultText: string,
  containerStyle?: Object,
  textStyle?: Object,
  children: React.Node<*>,
};

const CondContent = ({
  cond,
  defaultText,
  containerStyle,
  textStyle,
  children,
}: Props) => (
  cond ?
    children :
    <View style={containerStyle}>
      <Text style={textStyle}>{defaultText}</Text>
    </View>
);

CondContent.defaultProps = {
  containerStyle: {},
  textStyle: undefined,
};

export default CondContent;

// @flow
import * as React from 'react';
import withStateHandlers from 'recompose/withStateHandlers'
import { StyleSheet } from 'react-native';
import { Button, Text, View } from 'native-base';

import { row } from 'src/common/utils/styles';

type Props = {
  tab1Text: string,
  tab2Text: string,
  content1: React.Node<*>,
  content2: React.Node<*>,
  tabIndex: number,
  setTab1(): void,
  setTab2(): void,
  children: React.Node<*>,
};

// const styles = StyleSheet.create({
//
// });

const TabHostButton = ({
  tabIndex,
  tab1Text,
  tab2Text,
  setTab1,
  setTab2,
  content1,
  content2,
  children,
}: Props) => (
  <View>
    <View style={row}>
      <Button
        light // ={tabIndex === 0}
        flex1
        small
        bordered={tabIndex !== 0}
        transparent={tabIndex !== 0}
        onPress={setTab1}
      >
        <Text>{tab1Text}</Text>
      </Button>
      <Button
        light // ={tabIndex === 1}
        flex1
        small
        bordered={tabIndex !== 1}
        transparent={tabIndex !== 1}
        onPress={setTab2}
      >
        <Text>{tab2Text}</Text>
      </Button>
    </View>
    {children}
    {tabIndex === 0 && content1}
    {tabIndex === 1 && content2}
  </View>
);

const enhance = withStateHandlers({
  tabIndex: 0,
}, {
  setTab1: () => () => ({ tabIndex: 0 }),
  setTab2: () => () => ({ tabIndex: 1 }),
});

export default enhance(TabHostButton)

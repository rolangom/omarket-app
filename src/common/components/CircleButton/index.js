// @flow
import * as React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { centered, centerText, padS } from '../../utils/styles';
import variables from 'app/native-base-theme/variables/commonColor';

type Props = {
  title: string,
  size: number,
  onPress(): void,
}

const styles = StyleSheet.create({
  btn: {
    borderWidth: 1,
    borderRadius: variables.tabFontSize,
    borderColor: variables.brandDark,
    alignItems: 'center',
    justifyContent: 'center',
    height: variables.tabFontSize * 2,
    width: variables.tabFontSize * 2,
    marginHorizontal: padS,
  },
  text: {
    fontSize: variables.tabFontSize * 1.35,
    lineHeight: variables.tabFontSize * 1.35,
    textAlign: 'center',
    color: variables.brandDark,
  },
});

const CircleButton = (props: Props) => (
  <TouchableOpacity
    style={styles.btn}
    onPress={props.onPress}
  >
    <Text style={styles.text}>{props.title}</Text>
  </TouchableOpacity>
);

export default CircleButton;

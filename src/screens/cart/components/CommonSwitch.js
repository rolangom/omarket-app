// @flow
import * as React from 'react';
import { Switch } from 'react-native';
import { ListItem, Body, Text, Right } from 'native-base';
import { darkGray, lightGray, switchTrackColor } from '../../../common/utils/constants';

type Props = {
  title: string,
  subtitle: string,
  value: boolean,
  onChange: boolean => void,
};

const CommonSwitch = ({ title, subtitle, value, onChange }: Props) => (
  <ListItem>
    <Body>
      <Text>{title}</Text>
      <Text note>
        {' '}
        {subtitle}
      </Text>
    </Body>
    <Right>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={switchTrackColor}
      />
    </Right>
  </ListItem>
);


export default CommonSwitch;

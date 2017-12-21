// @flow
import React from 'react';

import {
  Container,
  Header,
  Content,
  Left,
  Body,
  Right,
  Title,
  Text,
  Button,
  Icon,
} from 'native-base';
import { NavigationNavigatorProps } from 'react-navigation/src/TypeDefinition';

const SettingsScreen = ({ navigation }: NavigationNavigatorProps) => (
  <Container>
    <Content>
      <Text>
        This is Content Section
      </Text>
    </Content>
  </Container>
);

SettingsScreen.navigationOptions = {
  title: 'Settings',
  headerRight: null,
};

export default SettingsScreen;

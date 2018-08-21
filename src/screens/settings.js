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

const SettingsScreen = () => (
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

// @flow
import React from 'react';
import {
  List,
  ListItem,
  Thumbnail,
  Left,
  Body,
  Text,
  View,
  Button,
} from 'native-base';
import type { User } from '../../config/types';

type Props = {
  user: User,
  isLoading: boolean,
  onLogout: () => void,
}

const UserInfoView = ({ user, isLoading, onLogout }: Props) => (
  <View>
    <List>
      <ListItem avatar>
        <Left>
          <Thumbnail source={{ uri: user.photoURL }} />
        </Left>
        <Body>
          <Text>{user.displayName}</Text>
          <Text note>{user.email}</Text>
        </Body>
      </ListItem>
    </List>
    <Button
      dark
      block
      onPress={onLogout}
      disabled={isLoading}
    >
      <Text>Cerrar Sesión</Text>
    </Button>
  </View>
);

export default UserInfoView;

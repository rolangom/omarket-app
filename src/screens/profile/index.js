// @flow

import React from 'react';
import {
  Container,
  Content,
  Separator,
} from 'native-base';
import UserInfoView from './info-view';
import UserContent from '../../common/components/user-content';

const ProfileScreen = () => (
  <Container>
    <Content padder>
      <UserContent>
        <UserInfoView />
      </UserContent>
      <Separator />
    </Content>
  </Container>
);

export default ProfileScreen;

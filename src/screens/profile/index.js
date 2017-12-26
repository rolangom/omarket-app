// @flow

import React from 'react';
import {
  Container,
  Content,
} from 'native-base';
import UserInfoView from './info-view';
import UserContent from '../../common/components/user-content';


const ProfileScreen = () => (
  <Container>
    <Content padder>
      <UserContent>
        <UserInfoView />
      </UserContent>
    </Content>
  </Container>
);

export default ProfileScreen;

// @flow
import * as React from 'react';
import { Container, Content } from 'native-base';
import UserContent from '../../../common/components/user-content';
import List from './components/List';


const SavedCartsListScreen = () => (
  <Container>
    <Content>
      <UserContent>
        <List />
      </UserContent>
    </Content>
  </Container>
);

export default SavedCartsListScreen;


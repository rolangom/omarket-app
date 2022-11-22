// @flow
import * as React from 'react';
import { Container, Content } from 'native-base';
import UserContent from 'src/common/components/user-content';
import List from './components/list';


const OrderListScreen = () => (
  <Container>
    <Content>
      <UserContent>
        <List />
      </UserContent>
    </Content>
  </Container>
);

export default OrderListScreen;

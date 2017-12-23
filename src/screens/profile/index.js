// @flow

import React from 'react';
import { connect } from 'react-redux';
import {
  Container,
  Content,
  Text,
  Button,
  Icon,
} from 'native-base';
import type { State, User } from '../../config/types';
import { loginWithFacebook, logout } from '../../ducks/user';
import UserInfoView from './info-view';

export type Props = {
  user: ?User,
  onLoginWithFacebook: () => void,
  onLogout: () => void,
  isLoading: boolean,
};

class ProfileScreen extends React.Component<Props> {
  render() {
    const {
      user,
      onLoginWithFacebook,
      onLogout,
      isLoading,
    } = this.props;
    return (
      <Container>
        <Content padder>
          {user ?
            <UserInfoView
              user={user}
              isLoading={isLoading}
              onLogout={onLogout}
            />
            :
            <Button
              info
              block
              iconLeft
              onPress={onLoginWithFacebook}
              disabled={isLoading}
            >
              <Icon name="logo-facebook" />
              <Text>Iniciar con Facebook</Text>
            </Button>
          }
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = (state: State) => ({
  user: state.user,
  isLoading: state.global.isLoading,
});
const mapDispatchToProps = (dispatch) => ({
  onLoginWithFacebook: () => dispatch(loginWithFacebook()),
  onLogout: () => dispatch(logout()),
});
export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);

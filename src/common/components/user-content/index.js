// @flow
import React from 'react';
import { connect } from 'react-redux';
import {
  View,
  Button,
  Icon,
  Text,
} from 'native-base';
import type { State, User } from '../../types';
import { loginWithFacebook } from '../../../ducks/user';

type Props = {
  user: User,
  isLoading: boolean,
  onLoginWithFacebook: () => void,
  children: React.Node<*>,
}

const UserContent = ({
  user,
  isLoading,
  onLoginWithFacebook,
  children,
}: Props) => (
  <View>
    {user ?
      children
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
  </View>
);


const mapStateToProps = (state: State) => ({
  user: state.user,
  isLoading: state.global.isLoading,
});
const mapDispatchToProps = (dispatch) => ({
  onLoginWithFacebook: () => dispatch(loginWithFacebook()),
});
export default connect(mapStateToProps, mapDispatchToProps)(UserContent);

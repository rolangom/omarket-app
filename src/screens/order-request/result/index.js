// @flow
import * as React from 'react';
import { Container, Content, View, H1, Button, Text } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { green, red } from '../../../common/utils/constants';
import { getNavParamsFromProp } from '../../../common/utils';
import {NavigationActions} from "react-navigation";

type Props = {
  // message: string,
  // isError: boolean,
  navigation: {
    navigate: (string, Object) => void,
    goBack: () => void,
    dispatch: (Object) => void,
    state: {
      params: {
        message: string,
        isError: boolean,
      },
    },
  },
};

const styles = {
  innerContent: {
    padding: 15,
    backgroundColor: 'white',
  },
  main: {
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    padding: 15,
    textAlign: 'center',
  },
};

const navActionSucc = NavigationActions.reset({
  index: 0,
  actions: [
    NavigationActions.navigate({ routeName: 'Cart' }),
  ],
});

export default class OrderRequestResult extends React.Component<Props> {
  onPress = () => {
    getNavParamsFromProp(this.props).isError
      ? this.props.navigation.goBack()
      : this.navigateOnSucced();
  };
  navigateOnSucced = () => {
    this.props.navigation.dispatch(navActionSucc);
    this.props.navigation.navigate('Orders');
  };
  render() {
    const { message, isError } = getNavParamsFromProp(this.props);
    return (
      <Container>
        <Content padder>
          <View style={styles.innerContent}>
            <View style={styles.main}>
              <Ionicons
                name={isError ? 'md-close-circle' : 'md-checkmark-circle'}
                color={isError ? red : green}
                size={200}
              />
            </View>
            <H1 style={styles.message}>{message}</H1>
            <Button block primary onPress={this.onPress}>
              <Text>{isError ? 'Intentar otra vez' : 'OK'}</Text>
            </Button>
          </View>
        </Content>
      </Container>
    );
  }
}

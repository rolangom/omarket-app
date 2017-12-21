// @flow
import React from 'react';
import {
  StyleSheet,
  Dimensions,
} from 'react-native';
import {
  Card,
  CardItem,
  H2,
  Text,
  View,
  Button,
  Left,
  Body,
  Right,
  Title,
} from 'native-base';
import { connect } from 'react-redux';

import { deleteMessage } from '../../../ducks/global/index';
// import { brandBlue, brandRed } from './utils';
import type { Message } from '../../../config/types';

const { width, height } = Dimensions.get('window');

const styles = {
  container: {
    // ...StyleSheet.absoluteFillObject,
    // justifyContent: 'center',
    // alignItems: 'center',
    // margin: 25,
    alignSelf: 'center',
    width,
    height: height * 0.5,
  },
  box: {
    // flex: 1,
  },
};

const Messages = ({ message, onOkPress }: Message) => (message ?
  <View style={styles.container}>
    <Card style={styles.box}>
      <CardItem header>
        <Text>
          {message.title || (message.type === 'error' ? 'Error' : 'Info')}
        </Text>
      </CardItem>
      <CardItem cardBody>
        <Body>
          <Text>{message.text}</Text>
        </Body>
      </CardItem>
      <CardItem footer>
        <Body>
          <Button
            block
            danger={message.type === 'error'}
            onPress={onOkPress}
          >
            <Title>OK</Title>
          </Button>
        </Body>
      </CardItem>
    </Card>
  </View>
  : null
);

const mapStateToProps = ({ global: { messages: [message] } }) => ({ message });
const mapDispatchToProps = (dispatch) => ({
  onOkPress: () => dispatch(deleteMessage()),
});
export default connect(mapStateToProps, mapDispatchToProps)(Messages);

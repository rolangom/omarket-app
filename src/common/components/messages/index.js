// @flow
import React from 'react';
import {
  Button,
} from 'react-native';
import {
  Text,
  View,
} from 'native-base';
import { connect } from 'react-redux';

import {
  Dialog,
} from 'react-native-simple-dialogs';

import { deleteMessage } from '../../../ducks/global/index';
import type { Message } from '../../types';
import { red } from '../../utils/constants';

type Props = {
  message: Message,
  onAccept: () => void,
};

const getTitle = (msg: Message) =>
  (msg && (msg.title || (msg.type === 'error' ? 'Error' : 'Info'))) || 'Alerta';

const Messages = ({ message, onAccept }: Props) => (
  <Dialog
    visible={!!message}
    title={getTitle(message)}
  >
    <View>
      <Text>{message && message.text}</Text>
      <Button
        title="OK"
        onPress={onAccept}
        color={red}
      />
    </View>
  </Dialog>
);

const mapStateToProps = ({ global: { messages: [message] } }) => ({ message });
const mapDispatchToProps = {
  onAccept: deleteMessage,
};
export default connect(mapStateToProps, mapDispatchToProps)(Messages);

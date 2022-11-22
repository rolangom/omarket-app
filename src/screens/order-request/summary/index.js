// @flow
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { withProps, compose } from 'recompose';
import { Container, Content, Text, Button, Form, View } from 'native-base';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Form as FinalForm } from 'react-final-form';
import { row, centered } from 'src/common/utils/styles';

type Props = {
  total: string,
};

const Summary = (props: Props) => (
  <Container>
    <Content whiteBackground>
      <View style={[row, centered]}>
        <Text>Su total es: </Text>
        <Text primary>{props.total}</Text>
      </View>
    </Content>
  </Container>
);

const enhance = compose(
  withProps({
    total: '$123.45',
  }),
);

export default enhance(Summary);

// @flow

import React from 'react';
import { connect } from 'react-redux';
import {
  Container,
  Content,
  List,
  ListItem,
  Text,
  Body,
  Fab,
  Icon,
  Right,
} from 'native-base';
import type { Address, State } from '../../common/types';
import { lightGray } from '../../common/utils/constants';

type Props = {
  items: Address[],
  onGoAddNew: () => void,
  onGoEdit: (string) => void,
};

const testData = [
  { name: 'Casa' },
  { name: 'Trabajo' },
];

const styles = {
  text: {
    color: lightGray,
    textAlign: 'center',
    fontSize: 22,
  },
  icon: {
    fontSize: 24,
    color: lightGray,
  },
};

class AddressList extends React.Component<Props> {
  renderItem = (address: Address) => (
    <ListItem
      button
    >
      <Body>
        <Text style={styles.text}>{address.name}</Text>
      </Body>
      <Right>
        <Icon
          name="ios-arrow-forward"
          style={styles.icon}
        />
      </Right>
    </ListItem>
  );

  onGoAddNew = () => console.log('onGoAddNew');

  render() {
    const { items } = this.props;
    return (
      <Container>
        <Content>
          <List
            dataArray={items}
            renderRow={this.renderItem}
          />
          <Fab
            active
            primary
            onPress={this.onGoAddNew}
          >
            <Icon name="md-add" />
          </Fab>
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = (state: State, { navigation: { navigate } }) => ({
  items: testData, // Object.values(state.addresses.byId),
});
export default connect(mapStateToProps)(AddressList);

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
import Link from '../../common/components/link';
import { lightGray, red } from '../../common/utils/constants';
import { getAllAddresses } from '../../ducks/addresses/selectors';
import { fetchAddresses as fetchAddressesAction } from '../../ducks/addresses';
import UserContent from '../../common/components/user-content';

type Props = {
  items: Address[],
  fetchAddresses: () => void,
};

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
  fab: {
    backgroundColor: red,
  },
};

class AddressList extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchAddresses();
  }
  renderItem = (address: Address) => (
    <Link
      component={ListItem}
      to="AddressEditor"
      params={address}
      thumbnail
      button
      key={address.id}
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
    </Link>
  );

  render() {
    const { items } = this.props;
    return (
      <Container>
        <Content>
          <UserContent>
            <List
              dataArray={items}
              renderRow={this.renderItem}
            />
          </UserContent>
        </Content>
        <Link
          component={Fab}
          to="AddressEditor"
          primary
          style={styles.fab}
          position="bottomRight"
        >
          <Icon name="md-add" />
        </Link>
      </Container>
    );
  }
}

const mapStateToProps = (state: State) => ({
  items: getAllAddresses(state),
});
const mapDispatchToProps = dispatch => ({
  fetchAddresses: () => dispatch(fetchAddressesAction()),
});
export default connect(mapStateToProps, mapDispatchToProps)(AddressList);

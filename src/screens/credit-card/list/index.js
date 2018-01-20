// @flow

import React from 'react';
import { connect } from 'react-redux';
import {
  Container,
  Content,
  List,
  ListItem,
  Left,
  Text,
  Body,
  Fab,
  Icon,
  Right,
} from 'native-base';
import { FontAwesome } from '@expo/vector-icons';
import type { CreditCard, State } from '../../../common/types';
import Link from '../../../common/components/link/index';
import {
  mapCreditCardTypeAsIconName,
  formatCreditCardText,
} from '../../../common/utils/index';
import { lightGray, red } from '../../../common/utils/constants';
import { fetchCreditcards as fetchCredicardsAction } from '../../../ducks/credit-cards/index';
import UserContent from '../../../common/components/user-content/index';

type Props = {
  items: CreditCard[],
  fetchItems: () => void,
};

const styles = {
  text: {
    color: lightGray,
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

class CreditCardList extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchItems();
  }
  renderItem = (creditCard: CreditCard) => (
    <Link
      component={ListItem}
      to="CreditcardEditor"
      params={creditCard}
      thumbnail
      button
      key={creditCard.id}
    >
      <Left>
        <FontAwesome
          name={mapCreditCardTypeAsIconName(creditCard.type)}
          color={lightGray}
          size={32}
        />
      </Left>
      <Body>
        <Text style={styles.text}>{formatCreditCardText(creditCard)}</Text>
      </Body>
      <Right>
        <Icon name="ios-arrow-forward" style={styles.icon} />
      </Right>
    </Link>
  );

  render() {
    const { items } = this.props;
    return (
      <Container>
        <Content>
          <UserContent>
            <List dataArray={items} renderRow={this.renderItem} />
          </UserContent>
        </Content>
        <Link
          component={Fab}
          to="CreditcardEditor"
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
  items: Object.values(state.creditCards.byId),
});
const mapDispatchToProps = dispatch => ({
  fetchItems: () => dispatch(fetchCredicardsAction()),
});
export default connect(mapStateToProps, mapDispatchToProps)(CreditCardList);

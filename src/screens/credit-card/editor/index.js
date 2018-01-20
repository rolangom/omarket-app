// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import {
  Container,
  Content,
  List,
  ListItem,
  Body,
  Left,
  Button,
  Text,
} from 'native-base';
import { CreditCardInput } from 'react-native-credit-card-input';
import { FontAwesome } from '@expo/vector-icons';

import type { CreditCard, State, CreditCardForm } from '../../../common/types';
import {
  requestDeleteCreditcard,
  postCreditcard,
} from '../../../ducks/credit-cards/index';
import UserContent from '../../../common/components/user-content/index';
import {
  mapCreditCardTypeAsIconName,
  formatCreditCardText,
} from '../../../common/utils/index';

type Props = {
  isLoading: boolean,
  onSubmit: CreditCard => void,
  onDelete: () => void,
  creditCard?: CreditCard,
};

type CompState = {
  valid: boolean,
  values: CreditCard,
};

class CreditCardEditor extends React.Component<Props, CompState> {
  state = {
    valid: false,
    values: {
      ...this.props.creditCard,
    },
  };
  onSubmit = () => this.props.onSubmit(this.state.values);
  onChangeValues = (form: CreditCardForm) =>
    this.setState((prevState: CompState) => ({
      valid: form.valid,
      values: {
        ...prevState.values,
        ...form.values,
      },
    }));
  render() {
    const { isLoading, onDelete, creditCard } = this.props;
    return (
      <Container>
        <Content padder>
          <UserContent>
            <List white>
              {creditCard && (
                <ListItem thumbnail>
                  <Left>
                    <FontAwesome
                      name={mapCreditCardTypeAsIconName(creditCard.type)}
                      size={32}
                    />
                  </Left>
                  <Body>
                    <Text>{formatCreditCardText(creditCard)}</Text>
                  </Body>
                </ListItem>
              )}
              <ListItem>
                <CreditCardInput
                  onChange={this.onChangeValues}
                  requiresCVC={false}
                />
              </ListItem>
              <ListItem>
                <Body>
                  <Button
                    primary
                    block
                    onPress={this.onSubmit}
                    disabled={!this.state.valid || isLoading}
                  >
                    <Text>Guardar</Text>
                  </Button>
                </Body>
              </ListItem>
              <ListItem>
                <Body>
                  {creditCard && (
                    <Button dark block onPress={onDelete} disabled={isLoading}>
                      <Text>Eliminar</Text>
                    </Button>
                  )}
                </Body>
              </ListItem>
            </List>
          </UserContent>
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = (state: State, ownProps) => {
  const id: string =
    ownProps.navigation &&
    ownProps.navigation.state.params &&
    ownProps.navigation.state.params.id;
  return {
    isLoading: state.global.isLoading,
    creditCard: id && state.creditCards.byId[id],
  };
};
const mapDispatchToProps = dispatch => ({
  onSubmit: (creditCard: CreditCard) => dispatch(postCreditcard(creditCard)),
  onDelete: (id: string) => dispatch(requestDeleteCreditcard(id)),
});
const mergeProps = (stateProps, dispatchProps) => ({
  ...stateProps,
  ...dispatchProps,
  onDelete: () => dispatchProps.onDelete(stateProps.creditCard.id),
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(
  CreditCardEditor,
);

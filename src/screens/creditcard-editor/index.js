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

import type { CreditCard, State } from '../../common/types';
import { requestDeleteCreditcard, postCreditcard as postCreditcardAction } from '../../ducks/credit-cards';
import UserContent from '../../common/components/user-content';
import { getLast4Chars, mapCreditCardTypeAsIconName, mapCreditCardTypeName } from '../../common/utils';


type Props = {
  isLoading: boolean;
  postCreditcard: (CreditCard) => void,
  onDelete: () => void,
  creditCard?: CreditCard,
};

type CompState = {
  valid: boolean,
  values: CreditCard,
};

type CreditCardForm = {
  valid: boolean,
  values: {
    number: string,
    expiry: string,
    cvc: string,
    type: string,
    name: string,
    postalCode: string,
  },
  status: {
    number: string,
    expiry: string,
    cvc: string,
    name: string,
    postalCode: string,
  },
};

class CreditCardEditor extends React.Component<Props, CompState> {
  state = {
    valid: false,
    values: {
      ...this.props.creditCard,
    },
  };
  onSubmit = () => this.props.postCreditcard(this.state.values);
  onChangeValues = (form: CreditCardForm) => this.setState((prevState: CompState) => ({
    valid: form.valid,
    values: {
      ...prevState.values,
      ...form.values,
    },
  }));
  render() {
    const {
      isLoading,
      onDelete,
      creditCard,
    } = this.props;
    return (
      <Container>
        <Content padder>
          <UserContent>
            <List white>
              {creditCard &&
                <ListItem
                  thumbnail
                >
                  <Left>
                    <FontAwesome
                      name={mapCreditCardTypeAsIconName(creditCard.type)}
                      size={32}
                    />
                  </Left>
                  <Body>
                    <Text>
                      {mapCreditCardTypeName(creditCard.type)} Ending in {getLast4Chars(creditCard.number)}
                    </Text>
                  </Body>
                </ListItem>
              }
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
                  {creditCard &&
                    <Button
                      dark
                      block
                      onPress={onDelete}
                      disabled={isLoading}
                    >
                      <Text>Eliminar</Text>
                    </Button>
                  }
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
  const id: string = ownProps.navigation
    && ownProps.navigation.state.params
    && ownProps.navigation.state.params.id;
  return {
    isLoading: state.global.isLoading,
    creditCard: id && state.creditCards.byId[id],
  };
};
const mapDispatchToProps = (dispatch) => ({
  postCreditcard: (creditCard: CreditCard) => dispatch(postCreditcardAction(creditCard)),
  onDelete: (id: string) => dispatch(requestDeleteCreditcard(id)),
});
const mergeProps = (stateProps, dispatchProps) => ({
  ...stateProps,
  ...dispatchProps,
  onDelete: () => dispatchProps.onDelete(stateProps.creditCard.id),
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(CreditCardEditor);

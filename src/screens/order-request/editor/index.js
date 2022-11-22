// @flow
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { Container, Content, Text, Button, Form, View } from 'native-base';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Form as FinalForm } from 'react-final-form';

import UserContent from 'src/common/components/user-content/index';
import OrderRequestForm from './components/form';
import NCFOrderSwitch from './components/NCFOrderSwitch';
import { formatCreditCardText } from 'src/common/utils/index';
import type {
  ValueLabel,
  OrderRequest,
  State,
} from 'src/common/types';
import { darkGray } from 'src/common/utils/constants';
import { postOrderRequest } from 'src/ducks/order-requests/index';
import { addError } from 'src/ducks/global';

type Props = {
  addresses: ValueLabel[],
  creditCards: ValueLabel[],
  onSubmit: OrderRequest => void,
  onError: string => void,
  values: {
    avWds: (number|string)[],
    avTmByWd: (number|string)[],
  },
};

const styles = StyleSheet.create({
  topText: {
    padding: 15,
  },
  row: {
    flexDirection: 'row',
  },
  addButton: {
    position: 'absolute',
    top: 15,
    right: 15,
  },
  padding: {
    padding: 15,
  },
  dateText: {
    paddingLeft: 5,
    paddingRight: 5,
    fontSize: 17,
    color: darkGray,
  },
});

const paymentMethods: ValueLabel[] = [
  { value: '', label: 'Seleccione' },
  { value: 'cash', label: 'Efectivo' },
  { value: 'credit-card', label: 'Tarjeta de crédito' },
];

class OrderRequestEditor extends React.Component<Props> {
  render() {
    const { addresses, creditCards, values, onSubmit, onError } = this.props;
    return (
      <Container>
        <KeyboardAwareScrollView>
          <UserContent>
            <Text style={styles.topText}>¿Dónde quieres que te enviemos?</Text>
            <FinalForm
              onSubmit={onSubmit}
              initialValues={values}
              render={({ handleSubmit, pristine, submiting }) => (
                <Form white>
                  <OrderRequestForm
                    addresses={addresses}
                    creditCards={creditCards}
                    paymentMethods={paymentMethods}
                    onError={onError}
                  />
                  <NCFOrderSwitch />
                  <View style={styles.padding}>
                    <Button
                      block
                      primary
                      disabled={pristine || submiting}
                      onPress={handleSubmit}
                    >
                      <Text>Terminar su compra</Text>
                    </Button>
                  </View>
                </Form>
              )}
            />
          </UserContent>
        </KeyboardAwareScrollView>
      </Container>
    );
  }
}

const mapStateToProps = (state: State): Props => {
  const addresses = Object.values(state.addresses.byId);
  const creditCards = Object.values(state.creditCards.byId);
  const { user: { avWds, avTmByWd } } = state;
  return {
    addresses: [
      { value: '', label: 'Seleccione' },
      ...addresses.map(it => ({ value: it.id, label: it.name })),
    ],
    creditCards: [
      { value: '', label: 'Seleccione' },
      ...creditCards.map(it => ({
        value: it.id,
        label: formatCreditCardText(it),
      })),
    ],
    values: {
      avWds,
      avTmByWd,
    },
  };
};
const mapDispatchToProps: Props = {
  onSubmit: postOrderRequest,
  onError: addError,
};
export default connect(mapStateToProps, mapDispatchToProps)(OrderRequestEditor);

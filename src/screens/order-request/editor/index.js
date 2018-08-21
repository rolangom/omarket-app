// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { Container, Content, Text, Button, Form, View } from 'native-base';
import { Form as FinalForm } from 'react-final-form';

import UserContent from '../../../common/components/user-content/index';
import OrderRequestForm from './components/form';
import NCFOrderSwitch from './components/NCFOrderSwitch';
import { formatCreditCardText } from '../../../common/utils/index';
import type {
  Address,
  CreditCard,
  OrderRequest,
  State,
} from '../../../common/types';
import { darkGray } from '../../../common/utils/constants';
import { postOrderRequest } from '../../../ducks/order-requests/index';
import { addError } from '../../../ducks/global';

type Props = {
  addresses: Address[],
  creditCards: CreditCard[],
  onSubmit: OrderRequest => void,
  onError: string => void,
};

const styles = {
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
};

const paymentMethods = [
  { value: '', label: 'Seleccione' },
  { value: 'cash', label: 'Efectivo' },
  { value: 'credit-card', label: 'Tarjeta de crédito' },
];

class OrderRequestEditor extends React.Component<Props> {
  render() {
    const { addresses, creditCards, onSubmit, onError } = this.props;
    const addressesToRender = [
      { value: '', label: 'Seleccione' },
      ...addresses.map(it => ({ value: it.id, label: it.name })),
    ];
    const ccToRender = [
      { value: '', label: 'Seleccione' },
      ...creditCards.map(it => ({
        value: it.id,
        label: formatCreditCardText(it),
      })),
    ];
    return (
      <Container>
        <Content>
          <UserContent>
            <Text style={styles.topText}>¿Dónde quieres que te enviemos?</Text>
            <FinalForm
              onSubmit={onSubmit}
              render={({ handleSubmit, pristine, submiting }) => (
                <Form white>
                  <OrderRequestForm
                    addresses={addressesToRender}
                    creditCards={ccToRender}
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
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = (state: State) => ({
  addresses: Object.values(state.addresses.byId),
  creditCards: Object.values(state.creditCards.byId),
});
const mapDispatchToProps = {
  onSubmit: postOrderRequest,
  onError: addError,
};
export default connect(mapStateToProps, mapDispatchToProps)(OrderRequestEditor);

// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { Button, Icon, Text } from 'native-base';
import type { Dispatch } from 'redux/index';
import { postCartProduct } from '../../ducks/cart';

type Props = {
  productID?: ?string,
  offerID?: ?string,
  onPress(): void,
};

const AddButton = (props: Props) => (
  <Button dark flex1 transparent onPress={props.onPress}>
    <Icon type="MaterialIcons" name="add-shopping-cart" />
    <Text>Agregar</Text>
  </Button>
);

const mapDispatchToProps = (
  dispatch: Dispatch,
  ownProps: Props,
): Props => ({
  onPress: () =>
    dispatch(postCartProduct(ownProps.productID, 1, ownProps.offerID, true)),
});

export default connect(null, mapDispatchToProps)(AddButton);

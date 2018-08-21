// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { ConfirmDialog } from 'react-native-simple-dialogs';
import { NavigationActions } from 'react-navigation';
import HorizProductList from '../HorizProductList';
import type { State } from '../../types';
import { setShowRelatedProdId } from '../../../ducks/global';

type Props = {
  visible: boolean,
  productId: string,
  onAccept: () => void,
  onCancel: () => void,
};

const styles = {
  dialog: {
    backgroundColor: 'white',
  },
};

const RelatedProductsDialog = ({
  visible,
  productId,
  onAccept,
  onCancel,
}: Props) => (
  <ConfirmDialog
    title="Productos relacionados"
    visible={visible}
    dialogStyle={styles.dialog}
    positiveButton={{
      title: 'Ir al carrito',
      onPress: onAccept,
    }}
    negativeButton={{
      title: 'Cont. compras',
      onPress: onCancel,
    }}
  >
    {productId && <HorizProductList productId={productId} />}
  </ConfirmDialog>
);

const mapStateToProps = (state: State): Props => ({
  visible: !!state.global.showRelatedProdId,
  productId: state.global.showRelatedProdId,
});
const mapDispatchToProps = (dispatch): Props => ({
  onAccept: () => {
    dispatch(NavigationActions.navigate({ routeName: 'Cart' }));
    dispatch(setShowRelatedProdId(null));
  },
  onCancel: () => {
    dispatch(NavigationActions.back());
    dispatch(setShowRelatedProdId(null));
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(
  RelatedProductsDialog,
);

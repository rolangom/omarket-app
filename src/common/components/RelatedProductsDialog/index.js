// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { Dimensions } from 'react-native';
import { ConfirmDialog } from 'react-native-simple-dialogs';
import { NavigationActions } from 'react-navigation';
import RelatedProductList from '../../../screens/home/components/products/relateds';
import type { State } from '../../types';
import { setShowRelatedProdId } from '../../../ducks/global';

type Props = {
  visible: boolean,
  productId: string,
  onAccept: () => void,
  onCancel: () => void,
};

const { width } = Dimensions.get('window');
const height = width * 0.85;
const styles = {
  dialog: {
    backgroundColor: 'white',
  },
  contentStyle: {
    padding: 0,
    height,
  },
  overlayStyle: {
    padding: 0,
    backgroundColor: '#00000033',
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
    contentStyle={styles.contentStyle}
    overlayStyle={styles.overlayStyle}
    positiveButton={{
      title: 'Ir al carrito',
      onPress: onAccept,
    }}
    negativeButton={{
      title: 'Cont. compras',
      onPress: onCancel,
    }}
  >
    <RelatedProductList
      addButton
      visible={!!productId}
      productId={productId}
    />
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

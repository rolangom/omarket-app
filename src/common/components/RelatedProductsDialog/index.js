// @flow
import * as React from 'react';
import type { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Dimensions, StyleSheet } from 'react-native';
import { ConfirmDialog } from 'react-native-simple-dialogs';
import { NavigationActions, StackActions } from 'react-navigation';
import ProductListItem from '../../../screens/home/components/products/list-item';
import { getOneRelatedProduct } from '../../../ducks/products/selectors';
import type { Product, State } from '../../types';
import { setShowRelatedProdId } from '../../../ducks/global';

type Props = {
  product: Product,
  visible: boolean,
  onAccept: () => void,
  onCancel: () => void,
};

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  dialog: {
    backgroundColor: 'white',
  },
  imgStyle: {
    width,
    height: width * 0.75,
  },
  contentStyle: {
    padding: 0,
    height: width * 1.15,
  },
  overlayStyle: {
    padding: 0,
    backgroundColor: '#00000033',
  },
});

const RelatedProductsDialog = ({
  product,
  visible,
  onAccept,
  onCancel,
}: Props) => (
  <ConfirmDialog
    title="Producto relacionado"
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
    <ProductListItem
      size={width}
      imgStyle={styles.imgStyle}
      item={product}
      addButton
    />
  </ConfirmDialog>
);

const mapStateToProps = (state: State): Props => ({
  visible: !!state.global.showRelatedProdId,
  product: !!(state.global.showRelatedProdId)
    ? getOneRelatedProduct(state.global.showRelatedProdId, state)
    : null,
});
const mapDispatchToProps = (dispatch: Dispatch): Props => ({
  onAccept: () => {
    dispatch(NavigationActions.navigate({ routeName: 'Cart' }));
    dispatch(setShowRelatedProdId(null));
  },
  onCancel: () => {
    const actionToDispatch = NavigationActions.navigate({
      routeName: 'Start',
      action: StackActions.popToTop(),
    });
    dispatch(actionToDispatch);
    dispatch(setShowRelatedProdId(null));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RelatedProductsDialog);

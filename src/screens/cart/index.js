// @flow
import React from 'react';
import { connect } from 'react-redux';
import { Container, Content, List, Button, Text, View } from 'native-base';
// import Prompt from 'react-native-prompt';

import CartListItem from './components/list-item';
import PriceView from '../../common/components/price-view';
import Ads from '../../common/components/ads';
import Link from '../../common/components/link';
import HorizProductList from '../../common/components/HorizProductList';
import type { CartItem, State } from '../../common/types';
import {
  getCartItems,
  getCartItemsSubTotalPrice,
} from '../../ducks/cart/selectors';
import { changeCartProductQty, changeCartProductDescr } from '../../ducks/cart';
import Prompt from '../../libs/react-native-prompt';
import ArchiveView from './components/ArchiveView';
import ExpressSwitch from './components/ExpressSwitch';

export type Props = {
  currency: string,
  itbisFactor: number,
  items: CartItem,
  subTotal: number,
  lastProdIdAdded: ?string,
  onChangeQty: (string, number) => void,
  onChangeDescr: (string, string) => void,
  onContinueShopping: () => void,
};

type CompState = {
  editingProdID: string,
};

const styles = {
  list: {
    paddingTop: 15,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    marginTop: 25,
  },
};

class CartScreen extends React.Component<Props, CompState> {
  state = { editingProdID: null };
  onEditPress = (editingProdID: string) => this.setState({ editingProdID });
  onCancelPrompt = () => this.onEditPress(null);
  onSubmitPrompt = (descr: string) => {
    this.props.onChangeDescr(this.state.editingProdID, descr);
    this.onCancelPrompt();
  };
  renderItem = (item: CartItem) => (
    <CartListItem
      key={item.productID}
      item={item}
      productId={item.productID}
      onChange={this.props.onChangeQty}
      onEditPress={this.onEditPress}
    />
  );
  render() {
    const {
      items,
      subTotal,
      onContinueShopping,
      lastProdIdAdded,
      currency,
      itbisFactor,
    } = this.props;
    const { editingProdID } = this.state;
    const itbis = (subTotal) * itbisFactor;
    return (
      <Container>
        <Content whiteBackground>
          <Ads visible forceLoad={false} />
          <HorizProductList productId={lastProdIdAdded} />
          <List
            dataArray={items}
            renderRow={this.renderItem}
            style={styles.list}
          />
          <ExpressSwitch />
          <PriceView value={subTotal} currency={currency} />
          <PriceView
            value={itbis}
            currency={`ITBIS ${itbisFactor * 100}% ${currency}`}
          />
          <PriceView
            value={subTotal + itbis}
            currency={`TOTAL ${currency}`}
          />
          <View style={styles.buttons}>
            <Link
              component={Button}
              light
              disabled={items.length <= 0}
              to="OrderRequest"
            >
              <Text>Terminar</Text>
            </Link>
            <Button primary onPress={onContinueShopping}>
              <Text>Continuar comprando</Text>
            </Button>
          </View>
          <ArchiveView disabled={items.length <= 0} />
        </Content>
        <Prompt
          title="Nota adicional"
          visible={!!editingProdID}
          onCancel={this.onCancelPrompt}
          onSubmit={this.onSubmitPrompt}
        />
      </Container>
    );
  }
}

const mapStateToProps = (state: State, { navigation }): Props => ({
  currency: state.global.currency,
  itbisFactor: parseFloat(state.global.itbis),
  items: getCartItems(state),
  subTotal:
    getCartItemsSubTotalPrice(state)
      + (state.global.isRushOrder
        ? parseFloat(state.global.rushPrice)
        : 0),
  lastProdIdAdded: state.global.lastProdIdAdded,
  onContinueShopping: () => navigation.goBack(null),
});

const mapDispatchToProps = dispatch => ({
  onChangeQty: (id: string, qty: number) =>
    dispatch(changeCartProductQty(id, qty)),
  onChangeDescr: (id: string, descr: string) =>
    dispatch(changeCartProductDescr(id, descr)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CartScreen);

/*

 */
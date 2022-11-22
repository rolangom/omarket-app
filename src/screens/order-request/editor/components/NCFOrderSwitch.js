// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { Switch } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { ListItem, Left, Body, Right, Text, Button, Icon } from 'native-base';
import { darkGray, lightGray, switchTrackColor } from '../../../../common/utils/constants';
import type { State, TaxInfo } from '../../../../common/types';
import { setUseNCF } from '../../../../ducks/user';

type Props = {
  value: boolean,
  taxInfo: TaxInfo,
  onNavigate: () => void,
  onChange: boolean => void,
};

const styles = {
  listitem: {
    height: 70,
  },
  switch: {
    alignSelf: 'center',
  },
};

const NCFOrderSwitch = ({ value, onChange, taxInfo, onNavigate }: Props) => (
  <ListItem icon style={styles.listitem}>
    <Left>
      <Button transparent onPress={onNavigate}>
        <Icon name="md-create" />
      </Button>
    </Left>
    <Body>
      <Text>Aplicar para NCF</Text>
      <Text note>
        {taxInfo && taxInfo.id
          ? `${taxInfo.id} ${taxInfo.name}`
          : '<- Presione el botón para editar'}
      </Text>
    </Body>
    <Right>
      <Switch
        style={styles.switch}
        value={value}
        disabled={taxInfo.name === undefined}
        onValueChange={onChange}
        trackColor={switchTrackColor}
      />
    </Right>
  </ListItem>
);

export default connect(
  (state: State) => ({
    taxInfo: state.user.taxInfo,
    value: state.user.usesNCF,
  }),
  dispatch => ({
    onChange: (value: boolean) => dispatch(setUseNCF(value)),
    onNavigate: () =>
      dispatch(
        NavigationActions.navigate({
          routeName: 'Profile',
        }),
      ),
  }),
)(NCFOrderSwitch);

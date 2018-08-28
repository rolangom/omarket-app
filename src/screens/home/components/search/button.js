// @flow
import * as React from 'react';
import { TouchableOpacity } from 'react-native';
import {
  Icon,
  Text,
  View,
  Button,
} from 'native-base';

const styles = {
  main: {
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'center',
    borderBottomColor: 'rgba(0,0,0,.15)',
    borderBottomWidth: 2,
  },
  icon: {
    fontSize: 18,
  },
};

type Props = {
  onPress: () => void,
};

const SearchButton = (props: Props) => (
  <TouchableOpacity onPress={props.onPress}>
    <View style={styles.main}>
      <Button
        dark
        transparent
        onPress={props.onPress}
      >
        <Icon name="ios-search" style={styles.icon} />
      </Button>
      <Text>Buscar...</Text>
    </View>
  </TouchableOpacity>
);

export default SearchButton;

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
        <Icon name="ios-search" />
      </Button>
      <Text>Buscar...</Text>
    </View>
  </TouchableOpacity>
);

export default SearchButton;

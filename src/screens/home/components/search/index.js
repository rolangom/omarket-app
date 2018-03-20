// @flow
import * as React from 'react';
import {
  Button,
  Icon,
  Input,
  View,
} from 'native-base';

const styles = {
  main: {
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'center',
    padding: 7,
  },
};

type Props = {
  searchTerm: string,
  onChangeText: (string) => void,
  onClosePress: () => void,
};

const Search = ({ onChangeText, searchTerm, onClosePress }: Props) => (
  <View style={styles.main}>
    <Button
      dark
      transparent
      onPress={onClosePress}
    >
      <Icon name="ios-close" />
    </Button>
    <Input
      autoFocus
      placeholder="Buscar..."
      value={searchTerm}
      onChangeText={onChangeText}
    />
    <Button
      dark
      transparent
    >
      <Icon
        dark
        name="ios-search"
      />
    </Button>
  </View>
);

export default Search;

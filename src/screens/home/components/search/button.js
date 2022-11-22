// @flow
import * as React from 'react';
import { compose, withHandlers } from 'recompose';
import { withNavigation } from 'react-navigation';
import { TouchableOpacity } from 'react-native';
import { lightGray } from 'src/common/utils/constants';
import { Icon, Text, View, Button } from 'native-base';

const styles = {
  main: {
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'center',
    borderBottomColor: lightGray,
    borderBottomWidth: 1,
  },
  icon: {
    fontSize: 18,
  },
};

type Props = {
  onPress: () => void,
  navigation: { navigate(string): void },
};

const SearchButton = (props: Props) => (
  <TouchableOpacity onPress={props.onPress}>
    <View style={styles.main}>
      <Button dark transparent onPress={props.onPress}>
        <Icon name="ios-search" style={styles.icon} />
      </Button>
      <Text>Buscar…</Text>
    </View>
  </TouchableOpacity>
);

const enhance = compose(
  withNavigation,
  withHandlers({
    onPress: (props: Props) => () => props.navigation.navigate('Search'),
  }),
);

export default enhance(SearchButton);

// @flow
import * as React from 'react';
import { View } from 'react-native';
import { Button, Text } from 'native-base';
import type { Location } from '../../types';
import ModalMap from './ModalMap';

type Props = {
  location: Location,
  onChange: Location => void,
  error: boolean,
};

type State = {
  visible: boolean,
};

class MapLocator extends React.Component<Props, State> {
  state = { visible: false };
  onHide = () => this.setState({ visible: false });
  shoMap = () => this.setState({ visible: true });

  render() {
    const { location, onChange, error } = this.props;
    return (
      <View>
        <Button
          dark={!error}
          primary={error}
          block
          bordered
          onPress={this.shoMap}
        >
          <Text>Geo-localizar</Text>
        </Button>
        <ModalMap
          location={location}
          visible={this.state.visible}
          onHide={this.onHide}
          onChange={onChange}
        />
      </View>
    );
  }
}

export default MapLocator;

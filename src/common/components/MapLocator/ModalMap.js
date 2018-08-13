// @flow
import * as React from 'react';
import { Button, Text, Icon } from 'native-base';
import { View, Modal } from 'react-native';
import type { Location } from '../../types';
import MapView from '../MapView';
import { Location as LocationService, Permissions } from 'expo';

type Props = {
  location: Location,
  onChange: Location => void,
  visible: boolean,
  onHide: () => void,
};

type State = {
  region: Location & {
    latitudeDelta: number,
    longitudeDelta: number,
  },
  locating: boolean,
};

const styles = {
  main: {
    flex: 1,
    flexDirection: 'column-reverse',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
};

class ModalMap extends React.Component<Props, State> {
  state = {
    location: {
      latitude: this.props.location.latitude,
      longitude: this.props.location.longitude,
    },
    locating: false,
  };
  mapRef: MapView = null;
  setMapRef = (ref: React.Node) => {
    this.mapRef = ref;
  };
  onChange = ({ latitude, longitude }: Location) =>
    this.setState({
      location: {
        latitude,
        longitude,
      },
    });
  onSet = () => {
    const { location: { latitude, longitude } } = this.state;
    const { onChange } = this.props;
    onChange &&
      onChange({
        latitude,
        longitude,
      });
    this.props.onHide();
  };
  getCurrLocationAsync = async () => {
    if (this.state.locating) {
      return;
    }
    this.setState({ locating: true });
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      alert('Permission to access location was denied');
    }

    try {
      const location = await LocationService.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      this.mapRef.setLocation({ latitude, longitude });
    } catch (err) {
      console.warn(err.message);
      alert(err.message);
    } finally {
      this.setState({ locating: false });
    }
  };
  onRequestClose = () => {};

  render() {
    const { location, locating } = this.state;
    const { visible, onHide } = this.props;
    return (
      <Modal
        onRequestClose={this.onRequestClose}
        animationType="slide"
        visible={visible}
      >
        <View style={styles.main}>
          <MapView
            ref={this.setMapRef}
            location={location}
            onChange={this.onChange}
          />
          <View style={styles.row}>
            <Button light onPress={onHide}>
              <Text>Volver</Text>
            </Button>
            <Button primary onPress={this.onSet}>
              <Text>Usar esta locación</Text>
            </Button>
          </View>
          <Button rounded light onPress={this.getCurrLocationAsync}>
            <Icon name={locating ? 'ios-compass-outline' : 'md-locate'} />
          </Button>
        </View>
      </Modal>
    );
  }
}

export default ModalMap;

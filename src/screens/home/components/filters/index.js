// @flow
import * as React from 'react';
import { Modal, View } from 'react-native';
import { Text, Button, Icon } from 'native-base';
import { connect } from 'react-redux';
import type { Dispatch } from 'react-redux';
import DropDown from '../../../../common/components/drop-down';
import type { State } from '../../../../common/types';
import { setFilters } from '../../../../ducks/global';
import { darkGray } from '../../../../common/utils/constants';
import { isFilterActive } from '../../../../ducks/global/selectors';

type LabelValue = {
  label: string,
  value: string,
};

type Props = {
  utilities: LabelValue[],
  contents: LabelValue[],
  filters: {
    utilities: ?string,
    contents: ?string,
  },
  onFilterUsefulAs: (value: ?string) => void,
  onFilterContent: (value: ?string) => void,
  isFilterActive: boolean,
};

type CompState = {
  visible: boolean,
};

const styles = {
  modal: {
    flex: 1,
    alignSelf: 'stretch',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, .75)',
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
  },
  horizontal: {
    flexDirection: 'row',
  },
};

const iconName = (active: boolean) =>
  active ? 'ios-funnel' : 'ios-funnel-outline';

class Filters extends React.Component<Props, CompState> {
  state = { visible: false };
  showModal = () => this.setState({ visible: true });
  hideModal = () => this.setState({ visible: false });
  render() {
    const {
      utilities,
      contents,
      filters,
      onFilterUsefulAs,
      onFilterContent,
    } = this.props;
    return (
      <View>
        <Button full light iconRight onPress={this.showModal}>
          <Text>Filtros</Text>
          <Icon
            name={iconName(this.props.isFilterActive)}
            size={24}
            color={darkGray}
          />
        </Button>
        <Modal transparent animationType="slide" visible={this.state.visible}>
          <View style={styles.modal}>
            <View style={styles.content}>
              <Button light full iconLeft onPress={this.hideModal}>
                <Icon name="md-close" />
                <Text>Filtros</Text>
              </Button>
              <DropDown
                defaultOpen
                label="Usos"
                placeholder="Ninguno"
                options={utilities}
                selectedValue={filters.utilities}
                onChange={onFilterUsefulAs}
              />
              <DropDown
                defaultOpen
                label="Contenido"
                placeholder="Ninguno"
                options={contents}
                selectedValue={filters.contents}
                onChange={onFilterContent}
              />
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const mapStateToProps = (state: State) => ({
  utilities: [{ label: 'Ninguno', value: null }].concat(
    state.global.utilities.map(it => ({ label: it, value: it })),
  ),
  contents: [{ label: 'Ninguno', value: null }].concat(
    state.global.contents.map(it => ({ label: it, value: it })),
  ),
  isFilterActive: isFilterActive(state),
  filters: state.global.filters,
});
const mapStateToDispatch = (dispatch: Dispatch) => ({
  onFilterUsefulAs: (value: ?string) =>
    dispatch(setFilters('utilities', value)),
  onFilterContent: (value: ?string) => dispatch(setFilters('contents', value)),
});
export default connect(mapStateToProps, mapStateToDispatch)(Filters);

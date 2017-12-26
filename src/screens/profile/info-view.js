// @flow
import React from 'react';
import { connect } from 'react-redux';
import {
  List,
  ListItem,
  Item,
  Input,
  Thumbnail,
  Left,
  Body,
  Text,
  View,
  Button,
  Picker,
  Separator,
} from 'native-base';
import DatePicker from 'react-native-datepicker';
import { Form, Field } from 'react-final-form';
import type { State, User } from '../../common/types';
import {
  logout,
  postUser,
} from '../../ducks/user';
import { darkGray, lighterGray } from '../../common/utils/constants';

export type Props = {
  user: User,
  isLoading: boolean,
  onLogout: () => void,
  onSave: () => void,
}

const styles = {
  datePickerDateTouch: {
    width: undefined,
    flex: 1,
  },
  datePicker: {
    dateInput: {
      borderWidth: 0,
      alignItems: 'flex-start',
      justifyContent: 'center',
    },
    dateText: {
      paddingLeft: 5,
      paddingRight: 5,
      fontSize: 17,
      color: darkGray,
    },
    placeholderText: {
      color: lighterGray,
    },
  },
};

class UserInfoView extends React.Component<Props> {

  render() {
    const {
      user,
      isLoading,
      onLogout,
      onSave,
    } = this.props;
    return (
      <View>
        <Form
          initialValues={user}
          onSubmit={onSave}
          render={({ handleSubmit, pristine, invalid }) =>(
            <List>
              <ListItem avatar>
                <Left>
                  <Thumbnail source={{ uri: user.photoURL }} />
                </Left>
                <Body>
                  <Text>{user.displayName}</Text>
                  <Text note>{user.email}</Text>
                </Body>
              </ListItem>
              <ListItem>
                <Body>
                  <Field
                    name="gender"
                    render={({ input, meta }) => (
                      <Picker
                        iosHeader="Sexo"
                        mode="dropdown"
                        placeholder="Seleccione"
                        selectedValue={input.value}
                        onValueChange={input.onChange}
                        textStyle={styles.datePicker.dateText}
                      >
                        <Picker.Item label="Masculino" value="M" />
                        <Picker.Item label="Femenino" value="F" />
                      </Picker>
                    )}
                  />
                  <Text note>Sexo</Text>
                </Body>
              </ListItem>
              <ListItem>
                <Body>
                  <Field
                    name="birthday"
                    render={({ input, meta }) => (
                      <DatePicker
                        confirmBtnText="OK"
                        cancelBtnText="Cancelar"
                        placeholder="Seleccione Fecha"
                        date={input.value}
                        onDateChange={input.onChange}
                        showIcon={false}
                        style={styles.datePickerDateTouch}
                        customStyles={styles.datePicker}
                      />
                    )}
                  />
                  <Text note>Fecha Nac.</Text>
                </Body>
              </ListItem>
              <ListItem>
                <Body>
                  <Item>
                    <Field
                      name="phoneNumber"
                      render={({ input, meta }) => (
                        <Input
                          value={input.value}
                          onChange={input.onChange}
                          keyboardType="phone-pad"
                        />
                      )}
                    />
                  </Item>
                  <Text note>Teléfono</Text>
                </Body>
              </ListItem>
              <ListItem>
                <Body>
                  {!pristine &&
                    <Button
                      primary
                      block
                      onPress={handleSubmit}
                      disabled={isLoading || invalid}
                    >
                      <Text>Guardar</Text>
                    </Button>
                  }
                  <Button
                    dark
                    block
                    onPress={onLogout}
                    disabled={isLoading}
                  >
                    <Text>Cerrar Sesión</Text>
                  </Button>
                </Body>
              </ListItem>
            </List>
          )}
        />
        <Separator />
      </View>
    );
  }
}

const mapStateToProps = (state: State) => ({
  user: state.user,
  isLoading: state.global.isLoading,
});
const mapDispatchToProps = (dispatch) => ({
  onLogout: () => dispatch(logout()),
  onSave: (user: User) => dispatch(postUser(user)),
});
export default connect(mapStateToProps, mapDispatchToProps)(UserInfoView);

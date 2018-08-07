// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import {
  ListItem,
  Item,
  Input,
  Thumbnail,
  Left,
  Body,
  Text,
  Form,
  Label,
  Button,
} from 'native-base';
import DatePicker from 'react-native-datepicker';
// import Prompt from 'react-native-prompt';
import { Form as FinalForm, Field } from 'react-final-form';
import DropDown from '../../common/components/drop-down';
import Visible from '../../common/components/visible';
import VisibleIfFieldEq from '../../common/components/visible-if-field-eq';
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
    flex: 1,
    alignSelf: 'stretch',
  },
  datePicker: {
    dateInput: {
      borderWidth: 0,
      alignItems: 'flex-start',
      justifyContent: 'center',
    },
    dateText: {
      fontSize: 17,
      color: darkGray,
    },
    placeholderText: {
      color: lighterGray,
    },
  },
};

const genders = [
  { label: 'Masculino', value: 'M' },
  { label: 'Femenino', value: 'F' },
];

const UserInfoView = ({
  user,
  isLoading,
  onLogout,
  onSave,
}: Props) => (
  <FinalForm
    initialValues={user}
    onSubmit={onSave}
    render={({ handleSubmit, pristine, invalid }) => (
      <Form white>
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
          <Text note>Puntos de lealtad: </Text>
          <Text>{user.points || 0}</Text>
        </ListItem>
        <Field
          name="taxInfo.id"
          render={({ input, meta: { touched, error } }) => (
            <Item
              stackedLabel
              error={touched && !!error}
            >
              <Label>Cédula\RNC</Label>
              <Input
                value={input.value}
                onChange={input.onChange}
              />
            </Item>
          )}
        />
        {user.taxInfo &&
          <VisibleIfFieldEq name="taxInfo" notEmpty>
            {user.taxInfo.name &&
              <Item stackedLabel>
                <Label>Nombre legal</Label>
                <Input value={user.taxInfo.name} editable={false} />
              </Item>
            }
            {user.taxInfo.commercialName &&
              <Item stackedLabel>
                <Label>Nombre comercial</Label>
                <Input value={user.taxInfo.commercialName} editable={false} />
              </Item>
            }
          </VisibleIfFieldEq>
        }
        <Field
          name="gender"
          render={({ input, meta: { touched, error } }) => (
            <Item
              stackedLabel
              error={touched && !!error}
            >
              <Label>Sexo</Label>
              <DropDown
                options={genders}
                onChange={input.onChange}
                selectedValue={input.value}
                placeholder="Seleccione"
              />
            </Item>
          )}
        />
        <Field
          name="birthday"
          render={({ input, meta: { touched, error } }) => (
            <Item
              stackedLabel
              error={touched && !!error}
            >
              <Label>Fecha Nac.</Label>
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
            </Item>
          )}
        />
        <Field
          name="phoneNumber"
          render={({ input, meta: { touched, error } }) => (
            <Item
              stackedLabel
              error={touched && !!error}
            >
              <Label>Teléfono</Label>
              <Input
                value={input.value}
                onChange={input.onChange}
                keyboardType="phone-pad"
              />
            </Item>
          )}
        />
        <ListItem>
          <Body>
            <Visible enabled={!pristine}>
              <Button
                primary
                block
                onPress={handleSubmit}
                disabled={isLoading || invalid}
              >
                <Text>Guardar</Text>
              </Button>
            </Visible>
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
      </Form>
    )}
  />
);

const mapStateToProps = (state: State) => ({
  user: state.user,
  isLoading: state.global.isLoading,
});
const mapDispatchToProps = (dispatch) => ({
  onLogout: () => dispatch(logout()),
  onSave: (user: User) => dispatch(postUser(user)),
});
export default connect(mapStateToProps, mapDispatchToProps)(UserInfoView);

// @flow
import * as React from 'react';
import { Field } from 'react-final-form';
import { Item, Label } from 'native-base';
import TagSelect from 'src/libs/tag-select';
import { availableTimes, weekDays } from '../utils/constants';

export const WeekdaysTimesField = () => (
  <React.Fragment>
    <Field
      name="avWds"
      allowNull
      render={({ input, meta: { touched, error } }) => (
        <Item stackedLabel error={touched && !!error}>
          <Label>Días de la semana para entregas</Label>
          <TagSelect
            items={weekDays}
            value={input.value}
            onChange={input.onChange}
          />
        </Item>
      )}
    />
    <Field
      name="avTmByWd"
      allowNull
      render={({ input, meta: { touched, error } }) => (
        <Item stackedLabel error={touched && !!error}>
          <Label>Horarios entregas</Label>
          <TagSelect
            items={availableTimes}
            value={input.value}
            onChange={input.onChange}
          />
        </Item>
      )}
    />
  </React.Fragment>
);

export default WeekdaysTimesField;

// @flow
import * as React from 'react';
import { Form as FinalForm, Field } from 'react-final-form';
import { Button, Text, Form, Item, Label, Input, Icon } from 'native-base';
import { View, Modal, TouchableOpacity } from 'react-native';
import StarRating from 'react-native-star-rating';
import { gray, yellow } from '../../../../../common/utils/constants';
import type { Rating } from '../../../../../common/types';


type Props = {
  rating: Rating,
  onRatingChange: Rating => void,
};

type CompState = {
  visible: boolean,
};

const styles = {
  modal: {
    flex: 1,
    // alignSelf: 'stretch',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, .75)',
  },
  content: {
    backgroundColor: 'white',
    alignItems: 'center',
    padding: 10,
  },
  innerButton: {
    padding: 15,
  },
};

class RatingView extends React.Component<Props, CompState> {
  state = { visible: false };
  onShowModal = () => this.setState({ visible: true });
  onHideModal = () => this.setState({ visible: false });
  onSubmit = (values: Rating) => {
    this.onHideModal();
    this.props.onRatingChange(values);
  };
  render() {
    return (
      <View>
        <TouchableOpacity onPress={this.onShowModal}>
          <View style={styles.innerButton}>
            <StarRating
              disabled
              maxStars={5}
              fullStarColor={yellow}
              emptyStarColor={gray}
              rating={this.props.rating.value}
            />
            <Text>{this.props.rating.message}</Text>
          </View>
        </TouchableOpacity>
        <Modal transparent animationType="slide" visible={this.state.visible}>
          <View style={styles.modal}>
            <FinalForm
              onSubmit={this.onSubmit}
              initialValues={this.props.rating}
              render={({ handleSubmit, pristine, invalid }) => (
                <Form style={styles.content}>
                  <Button light small onPress={this.onHideModal}>
                    <Icon name="md-close" />
                  </Button>
                  <Field
                    name="value"
                    render={({ input, meta: { touched, error } }) => (
                      <StarRating
                        maxStars={5}
                        fullStarColor={yellow}
                        emptyStarColor={gray}
                        rating={input.value}
                        selectedStar={input.onChange}
                      />
                    )}
                  />
                  <Field
                    name="message"
                    render={({ input, meta: { touched, error } }) => (
                      <Item floatingLabel>
                        <Label>Comentarios:</Label>
                        <Input
                          value={input.value}
                          onChangeText={input.onChange}
                        />
                      </Item>
                    )}
                  />
                  <Button full primary onPress={handleSubmit}>
                    <Text>Guardar</Text>
                  </Button>
                </Form>
              )}
            />
          </View>
        </Modal>
      </View>
    );
  }
}

RatingView.defaultProps = {
  rating: {
    value: 0,
    message: '',
  },
};

export default RatingView;

// @flow

import { currency } from './constants';
import type {
  CreditCard,
  CreditCardForm,
  OrderStatus,
  PaymentMethod,
  Offer,
} from '../types';

export function getFmtDocs(querySnapshot) {
  return querySnapshot && querySnapshot.docs
    ? querySnapshot.docs.map(it => ({ id: it.id, ...it.data() }))
    : [];
}

export function getRealtDocs(snapshot) {
  const data = [];
  snapshot.forEach(docSnapshot => {
    console.log('docSnapshot', docSnapshot.key);
    data.push({ id: docSnapshot.key, ...docSnapshot.val() });
  });
  return data;
}

export const getNavParamsFromProp = (props: Object) =>
  (props &&
    props.navigation &&
    props.navigation.state &&
    props.navigation.state.params) ||
  {};

const sortFnAsc = (attr: string) => (a, b) =>
  (a[attr] || 100) - (b[attr] || 100);
const sortFnDesc = (attr: string) => (a, b) =>
  (b[attr] || 100) - (a[attr] || 100);

export const sortBy = (data: Array<any>, attr: string, asc: boolean = true) =>
  data.sort((asc ? sortFnAsc : sortFnDesc)(attr));

export const getPriceWithCurrency = (
  price: number,
  pCurrency: string = currency,
) => `${pCurrency} ${price || 0}`;

export function getOfferPrice(price: number, offer: Offer) {
  switch (offer.type) {
    case 'percentage':
      return price - (price * offer.discount * 0.01);
    case 'fixedAmount':
      return price - offer.discount;
    default:
      return price;
  }
}

export const isOfferDiscount = (offer: Offer) => {
  switch (offer.type) {
    case 'percentage':
    case 'fixedAmount':
      return true;
    default:
      return false;
  }
};


export function padStart(num: number, places: number, char: string = '0') {
  const zero = places - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join(char) + num;
}

export const getLast4Chars = (number: string) => number.slice(-4);

export const replaceSpace = (str: string, replacement = '') =>
  str.replace(/ /g, replacement);

export const impureSetObjKey = (obj: Object) => (acc: Object, key: string) => (
  (acc[key] = obj[key]), acc
);

export const reduceFnByID = (acc: Object, it: Object) => {
  acc[it.id] = it;
  return acc;
};

export function setImmutable(obj: any, attr: string, value: any) {
  const attrArr = attr.split('.');
  const [tattr, nattr] = attrArr;
  return Object.assign({}, obj, {
    [tattr]: !!nattr
      ? setImmutable(obj[tattr] || {}, attrArr.slice(1).join('.'), value)
      : value,
  });
}

export function deleteImmutable(obj: Object, key: string) {
  const newObj = { ...obj };
  delete newObj[key];
  return newObj;
}

export const filterKeys = (obj: Object, keys: string[]) =>
  Object.keys(obj)
    .filter((key: string) => !!obj[key] && keys.includes(key))
    .reduce(impureSetObjKey(obj), {});

export const uniqFilterFn = (value: any, index: number, arr: Array<any>) =>
  arr.indexOf(value) === index;

export const inputRequired = value => (value ? undefined : 'Required');
export const inputCVCValidate = (value: string) =>
  value && value.length >= 3 ? undefined : 'Required';
export const inputIsPropValid = (object: CreditCardForm) =>
  object && object.valid ? undefined : 'Tarjeta inválida.';
export const parseCreditCardFormValue = (form: CreditCardForm) =>
  form && form.values;
export const parseCreditCardNumber = (form: CreditCardForm) =>
  form && {
    ...form,
    values: { ...form.values, number: replaceSpace(form.values.number) },
  };

export const composeValidators = (...validators) => value =>
  validators.reduce((error, validator) => error || validator(value), undefined);

export const queryDoc: Promise = (firebase: Firebase, path: string) =>
  firebase
    .database()
    .ref(path)
    .once('value');

export const upsertDoc: Promise = (
  firebase,
  path: string,
  { key, ...data }: Object,
) =>
  key
    ? firebase
        .database()
        .ref(path)
        .child(key)
        .set(data)
    : firebase
        .database()
        .ref(path)
        .push(data);

export const deleteDoc: Promise = (firebase, path: string) =>
  firebase
    .database()
    .ref(path)
    .remove();

export const upsertRealtDoc: Promise = (
  { id, ...data }: Object,
  dbRef: Object,
) => (id ? dbRef.child(id).set(data) : dbRef.push(data));

export const mapCreditCardTypeAsIconName = (type: string) => {
  switch (type) {
    case 'visa':
      return 'cc-visa';
    case 'master-card':
      return 'cc-mastercard';
    case 'american-express':
      return 'cc-amex';
    case 'diners-club':
      return 'cc-dinners-club';
    case 'discover':
      return 'cc-discover';
    case 'jcb':
      return 'cc-jcb';
    default:
      return 'cc';
  }
};

export const mapCreditCardTypeName = (type: string) => {
  switch (type) {
    case 'visa':
      return 'Visa';
    case 'master-card':
      return 'MasterCard';
    case 'american-express':
      return 'Amex';
    case 'diners-club':
      return 'DinnersClub';
    case 'discover':
      return 'Discover';
    case 'jcb':
      return 'JBC';
    default:
      return 'Tarjeta';
  }
};

export const getOrderStatusText = (status: OrderStatus) => {
  switch (status) {
    case 'reviewed':
      return 'Revisada';
    case 'sent':
      return 'Enviada';
    case 'completed':
      return 'Entregada';
    case 'placed':
    default:
      return 'Recibida';
  }
};

export const isOrderCompleted = (status: OrderStatus) => status === 'completed';

export const getPaymentMethodText = (paymentMethod: PaymentMethod) =>
  paymentMethod === 'cash' ? 'Efectivo' : 'Tarjeta de crédito';

export const formatCreditCardText = (creditCard: CreditCard) =>
  `${mapCreditCardTypeName(creditCard.type)} ...- ${getLast4Chars(
    creditCard.number,
  )}`;

export default null;

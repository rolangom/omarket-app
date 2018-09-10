// @flow

import { currency } from './constants';
import type {
  CreditCard,
  CreditCardForm,
  OrderStatus,
  PaymentMethod,
  Offer, CartItem, KeysOf,
} from '../types';

type Timestamp = {
  seconds: number,
  nanoseconds: number,
};

export const toDate = (timestamp: Timestamp | Date): Date =>
  timestamp instanceof Date
    ? timestamp
    : timestamp.toDate();

const toLocalStrEsDo = (date: Date): string =>
  date.toLocaleString('es-DO');

export const tsToDateStr = (timestamp: Timestamp | Date): string =>
  timestamp instanceof Date
    ? toLocalStrEsDo(timestamp)
    : timestamp.toDate !== undefined
    ? toLocalStrEsDo(timestamp.toDate())
    : toLocalStrEsDo(new Date(timestamp.seconds * 1000));

export function getFmtDocs(querySnapshot): Array {
  return querySnapshot && querySnapshot.docs
    ? querySnapshot.docs.map(it => ({ id: it.id, ...it.data() }))
    : [];
}

export function getRealtDocs(snapshot): Array {
  const data = [];
  snapshot.forEach(docSnapshot => (
    data.push({ id: docSnapshot.key, ...docSnapshot.val() }), false
  ));
  return data;
}

export const getNavParamsFromProp = (props: Object): Object =>
  (props &&
    props.navigation &&
    props.navigation.state &&
    props.navigation.state.params) ||
  {};

const sortFnAsc = (attr: string) => (a, b) =>
  (a[attr] || 100) - (b[attr] || 100);
const sortFnDesc = (attr: string) => (a, b) =>
  (b[attr] || 100) - (a[attr] || 100);

export const sortBy = (data: Array<any>, attr: string, asc: boolean = true): Array<any> =>
  data.sort((asc ? sortFnAsc : sortFnDesc)(attr));

export const getPriceWithCurrency = (
  price: number,
  pCurrency: string = currency,
): string => `${pCurrency} ${price || 0}`;

export function getOfferPrice(price: number, offer: ?Offer): number {
  switch (offer && offer.type) {
    case 'percentage':
      return price - (price * offer.discount * 0.01);
    case 'fixedAmount':
      return price - offer.discount;
    default:
      return price;
  }
}

export const getSecureTaxB1 = (taxFactor: ?number): number =>
  (taxFactor === undefined)
    ? 0
    : taxFactor > 1
    ? taxFactor * 0.01
    : taxFactor;

export const round2 = (num: number): number =>
  Math.round(num * 100) / 100;

export const getPriceWithTax = (
  price: number,
  taxFactor: ?number,
  offer: ?Offer,
  withCurrency: boolean = false,
): number => {
  const priceWithOffer = offer ? getOfferPrice(price, offer) : price;
  const priceRounded = round2(priceWithOffer * (1 + getSecureTaxB1(taxFactor)));
  return withCurrency ? getPriceWithCurrency(priceRounded) : priceRounded;
};

export const isOfferDiscount = (offer: ?Offer): boolean => {
  switch (offer && offer.type) {
    case 'percentage':
    case 'fixedAmount':
      return true;
    default:
      return false;
  }
};

export const isOfferFreeIncluded = (offer: Offer): boolean =>
  offer && offer.type === 'freeIncluded';

export function padStart(num: number, places: number, char: string = '0'): string {
  const zero = places - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join(char) + num;
}

export const getLast4Chars = (number: string): string => number.slice(-4);

export const replaceSpace = (str: string, replacement = ''): string =>
  str.replace(/ /g, replacement);

export const impureSetObjKey = (obj: Object) => (acc: Object, key: string): string => (
  (acc[key] = obj[key]), acc
);

export const reduceFnByID = (acc: Object, it: Object): Object => {
  acc[it.id] = it;
  return acc;
};

export function setImmutable(obj: Object, attr: string, value: any): Object|Array {
  const attrArr = attr.split('.');
  const [tattr, nattr] = attrArr;
  return Object.assign({}, obj, {
    [tattr]: !!nattr
      ? setImmutable(obj[tattr] || {}, attrArr.slice(1).join('.'), value)
      : value,
  });
}

export function deleteImmutable(obj: Object, key: string): Object|Array {
  const newObj = { ...obj };
  delete newObj[key];
  return newObj;
}

export const filterKeys = (obj: Object, keys: string[]): Object =>
  Object.keys(obj)
    .filter((key: string) => !!obj[key] && keys.includes(key))
    .reduce(impureSetObjKey(obj), {});

export const uniqFilterFn = (value: any, index: number, arr: Array<any>): boolean =>
  arr.indexOf(value) === index;

export const inputLocationRequired = (value: ?Object): ?string =>
  value && value.latitude
    ? undefined
    : 'Required';

export const inputRequired = (value: ?any): ?string => (value ? undefined : 'Required');
export const inputCVCValidate = (value: ?string) =>
  value && value.length >= 3 ? undefined : 'Required';
export const inputIsPropValid = (object: ?CreditCardForm) =>
  object && object.valid ? undefined : 'Tarjeta inválida.';
export const parseCreditCardFormValue = (form: ?CreditCardForm) =>
  form && form.values;
export const parseCreditCardNumber = (form: ?CreditCardForm) =>
  form && {
    ...form,
    values: { ...form.values, number: replaceSpace(form.values.number) },
  };

export const composeValidators = (...validators) => value =>
  validators.reduce((error, validator) => error || validator(value), undefined);

export const queryDoc = (firebase: Firebase, path: string): Promise =>
  firebase
    .database()
    .ref(path)
    .once('value');

export const upsertDoc = (
  firebase,
  path: string,
  { key, ...data }: Object,
): Promise =>
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

export const deleteDoc = (firebase, path: string): Promise =>
  firebase
    .database()
    .ref(path)
    .remove();

export const upsertRealtDoc = (
  { id, ...data }: Object,
  dbRef: Object,
): Promise => (id ? dbRef.child(id).set(data) : dbRef.push(data));

export const mapCreditCardTypeAsIconName = (type: string): string => {
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

export const mapCreditCardTypeName = (type: string): string => {
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

export const getOrderStatusText = (status: OrderStatus): string => {
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

export const assert = (cond: boolean, errMsg: string) => {
  if (!cond) {
    throw new Error(errMsg);
  }
};
export const multiDispatch = (dispatch, ...actions) =>
  actions.forEach(dispatch);
export default null;

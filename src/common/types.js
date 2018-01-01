// @flow

export type onNavigateParams = {
  path: string,
  params?: any,
};

export type Category = {
  id?: string,
  name: string,
  descr?: ?string,
  fileURL?: ?string,
  parent?: string,
  orderID?: number,
};

export type Ad = {
  id?: string,
  name: string,
  fileURL?: ?string,
  toURL?: string,
  orderID?: number,
};

export type Product = {
  id?: string,
  category: string,
  name: string,
  descr?: ?string,
  fileURL?: ?string,
  isActive?: boolean,
  orderID: number,
  price: number,
  qty: number,
  relatedProds: {
    [string]: boolean,
  },
};

export type CartItem = {
  productID: string,
  qty: number,
  descr?: string,
};

export type Location = {
  latitude: number,
  longitude: number,
};

export type Address = {
  id?: string,
  name: string,
  descr: string,
  extra?: ?string,
  location?: Location,
};

export type CreditCard = {
  number: string,
  expiry: string,
  cvc: string,
  type: string,
};

export type User = {
  uid: string,
  displayName: string,
  email: string,
  phoneNumber: string,
  gender: string,
  birthday: string,
  photoURL: string,
  taxInfo: {
    ced_rnc: string,
    nombre_razonSocial: string,
    nombreComercial: string,
    category: string,
    regPag: string,
    status: string,
    ecoAct: string,
  },
};

// ------------------------------------------------ //

export type MessageMode = "error"|"info"|"warning";

export type Message = {
  type: MessageMode,
  title?: string,
  text: string,
};

export type Global = {
  isLoading: boolean,
  messages: Array<Message>,
};

export type KeysOf<T> = {
  [key: string]: T,
};

export type Normalizd<T> = {
  byId: KeysOf<T>,
  allIds: string[],
};

export type State = {
  global: Global,
  categories: Normalizd<Category>,
  products: Normalizd<Product>,
  ads: Ad[],
  cartItems: Normalizd<CartItem>,
  addresses: Normalizd<Address>,
  creditCards: Normalizd<CreditCard>,
  user: ?User,
};

// @flow

export type KeysOf<T> = {
  [key: string]: T,
};

export type Normalizd<T> = {
  byId: KeysOf<T>,
  allIds: string[],
};

export type NormalizdRel<T> = {
  byId: KeysOf<T>,
  allIds: string[],
  rel: KeysOf<string[]>,
};

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
  nutritionFacts?: string,
  brand?: ?string,
  fileURL?: ?string,
  nutriFactsURL?: ?string,
  isActive?: boolean,
  orderID?: ?number,
  price: number,
  pricePer: string,
  taxFactor?: ?number,
  qty: number,
  contents?: ?string[],
  usefulAs?: ?string[],
  relatedProds?: {
    [string]: boolean,
  },
};

export type Offer = {
  id?: ?string,
  title: string,
  productId: string,
  type: 'fixedAmount' | 'percentage' | 'freeIncluded',
  discount: number,
  includedProducts: string[],
  beginDate: Date,
  endDate: Date,
  isBirthday: boolean,
  toGender: 'all'|'F'|'M',
};

export type CartItem = {
  productID: string,
  offerID: ?string,
  offer: ?Offer,
  qty: number,
  price?: number,
  descr?: string,
  product?: Product,
};

export type Location = {
  latitude: number,
  longitude: number,
};

export type MapRegion = Location & {
  latitudeDelta: number,
  longitudeDelta: number,
}

export type Address = {
  id?: string,
  name: string,
  descr: string,
  extra?: ?string,
  location?: Location,
};

export type CreditCard = {
  id?: string,
  number: string,
  expiry: string,
  cvc: string,
  type: string,
};

export type CreditCardForm = {
  valid: boolean,
  values: {
    number: string,
    expiry: string,
    cvc: string,
    type: string,
    name: string,
    postalCode: string,
  },
  status: {
    number: string,
    expiry: string,
    cvc: string,
    name: string,
    postalCode: string,
  },
};

export type PaymentMethod = 'cash' | 'credit-card';
export type OrderStatus =
  | 'inCart'
  | 'paymentDenied'
  | 'paid'
  | 'placed'
  | 'reviewed'
  | 'sent'
  | 'completed';

export type Rating = {
  value: ?number,
  message: ?string,
};

export type TaxInfo = {
  id: string,
  name: string,
  commercialName: string,
};

export type NCFInfo = TaxInfo & {
  seq: string,
  endDate: Date,
};

export type OrderRequest = {
  createdAt: Date,
  addressID: string,
  address: Address,
  cartItems: CartItem[],
  paymentMethod: PaymentMethod,
  creditCardID?: string,
  creditCard?: ?CreditCard,
  cashFor?: number,
  doSaveAddress?: boolean,
  authCode?: number,
  status?: OrderStatus,
  itbis?: number,
  itbisFactor?: number,
  subtotal?: number,
  rating: Rating,
  ncf?: NCFInfo,
  points: number,
  discounts: number,
  usePoints: boolean,
};


export type User = {
  uid: string,
  displayName: string,
  email: string,
  phoneNumber: string,
  gender: string,
  birthday: string,
  photoURL: string,
  taxInfo: TaxInfo,
  usesNCF: boolean,
  points: number,
  avWds: number[], // Available week days // 0 = Sunday, 1 = Monday; // [1,2,3,4,5]
  avTmByWd: KeysOf<number|string[]>, // Available times by week day // { 0: [1700,2100] }
};

// ------------------------------------------------ //

export type MessageMode = 'error' | 'info' | 'warning';

export type Message = {
  type: MessageMode,
  title?: string,
  text: string,
};

export type ValueLabel = {
  value: string,
  label: string,
}

export type KeyLabel = {
  key: string|number,
  label: string,
};

export type ConfirmConfig = {
  visible: boolean,
  title: string,
  message: string,
  acceptButtonText: string,
  acceptActionType?: ?string,
  cancelButtonText: string,
  cancelActionType?: ?string,
};

export type Global = {
  isLoading: boolean,
  messages: Array<Message>,
  utilities: string[],
  contents: string[],
  lastProdIdAdded: ?string,
  currency: ?string,
  itbis: ?string,
  rushPrice: string | number,
  isRushOrder: boolean,
  filters: {
    searchTerm: string,
    utilities: string,
    contents: string,
  },
  usePoints: boolean,
  reserveModalVisible: boolean,
  confirmModal: ConfirmConfig,
  showRelatedProdId: ?string,
};

export type Cart = {
  id: ?string,
  name: string,
  createdAt: Date,
  content: KeysOf<CartItem>,
};

export type State = {
  global: Global,
  categories: Normalizd<Category>,
  products: Normalizd<Product>,
  ads: Ad[],
  cartItems: Normalizd<CartItem>,
  savedCarts: Normalizd<Cart>,
  addresses: Normalizd<Address>,
  creditCards: Normalizd<CreditCard>,
  orders: Normalizd<OrderRequest>,
  offers: NormalizdRel<Offer>,
  user: ?User,
};

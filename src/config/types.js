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

export type State = {
  global: Global,
  categories: Category[],
  products: Product[],
  ads: Ad[],
};

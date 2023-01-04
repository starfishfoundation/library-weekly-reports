import { books } from "./books";

const appStore: any = {};

export const registerStore = () => {
  appStore.books = books();
};

export default appStore;

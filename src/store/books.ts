import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";

export const books = defineStore("books", () => {
  const books = useStorage<any>('books', {});
  function updateBook(id: string, book: any) {
    if (!books.value[id]) {
      books.value[id] = {}
    }
    books.value[id] = {
      ...books.value[id],
      ...book,
      updatedAt: +new Date(),
    }
  }

  return { books, updateBook };
});

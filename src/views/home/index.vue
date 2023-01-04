<script setup lang="ts">
import Papa from "papaparse";
import { detectBookData } from "~/utils/book";
import DropFile from "~/components/DropFile.vue";
import BookClassifier from "./components/BookClassifier.vue";
import appStore from "~/store";
</script>

<template>
  <div class="main">
    <DropFile @upload="handleUpload" />
    <BookClassifier
      v-if="inputData && inputData.length"
      :bookIds="activeBookIds" />
    <button
      v-if="inputData && inputData.length"
      class="btn btn-secondary mt-1"
      @click="finish">
      Finish
    </button>
  </div>
</template>

<script lang="ts">
export default {
  data() {
    return {
      inputData: null,
      activeBookIds: [],
    };
  },
  methods: {
    handleUpload(file) {
      this.inputData = null
      if (!file) {
        return
      }

      const reader = new FileReader()
      reader.addEventListener('load', () => {
        this.inputData = Papa.parse(reader.result, {
          header: true,
          skipEmptyLines: true,
        }).data

        const bookIds = new Set()
        for (const entry of this.inputData) {
          const key = entry['Item #']
          bookIds.add(key)
          if (!appStore.books.books[key]) {
            appStore.books.updateBook(key, {
              'Item #': entry['Item #'],
              'Item Title': entry['Item Title'],
              'Item Author': entry['Item Author'],
              'Item Barcode': entry['Item Barcode'],
              ...detectBookData(entry['Item Title']),
            })
          }
        }

        const toSortBookIds = [...bookIds]
        toSortBookIds.sort((a, b) => {
          const updA = appStore.books.books[a]?.updatedAt || Number.POSITIVE_INFINITY
          const updB = appStore.books.books[b]?.updatedAt || Number.POSITIVE_INFINITY
          return updB - updA
        })
        this.activeBookIds = toSortBookIds
      })
      reader.readAsText(file)
    },
    finish() {
    },
  },
};
</script>

<style scoped></style>

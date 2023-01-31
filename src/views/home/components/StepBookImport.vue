<script setup lang="ts">
import IconBook from '~icons/material-symbols/library-books'
import IconUpdated from '~icons/material-symbols/update-rounded'

import { getDateTime } from '~/utils/time'
import BookImportErrors from './BookImportErrors.vue'
</script>

<template>
  <div class="flex gap-4">
    <template v-if="bookImport.last">
      <div class="flex-grow shrink-0">
        <h2 class="text-xl font-bold mb-4">
          Use latest import
        </h2>
        <div class="card mx-auto w-96 bg-gray-700 shadow-xl">
          <div class="card-body p-6 text-left">
            <span>
              <IconBook class="inline-block" />
              {{ bookImport.last.count }} books
            </span>
            <span v-if="bookImport.last.lastModified">
              <IconUpdated class="inline-block" />
              updated at {{ getDateTime(bookImport.last.lastModified) }}
            </span>
            <div class="card-actions justify-center">
              <button
                @click="onContinue"
                class="btn btn-sm btn-outline btn-secondary mt-2">
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="divider divider-horizontal">OR</div>
    </template>
    <div class="flex-grow shrink-0">
      <h2 class="text-xl font-bold mb-4">
        Upload book database (JSON)
      </h2>
      <DropFile @upload="onUpload" />
      <p class="mt-2">
        Get export of books from LibraryThing
        <a
          class="link link-primary"
          href="https://www.librarything.com/export.php?export_type=json"
          target="_blank"
          rel="noopener noreferrer">here</a>.
      </p>
      <template v-if="bookImport.status === 'loading'">
        <div class="radial-progress animate-spin text-gray-300 mt-4" style="--value:90;"></div>
      </template>
    </div>
  </div>
  <div v-if="bookImport.status === 'error'" class="place-items-center">
    <BookImportErrors :key="bookImport.status" />
  </div>
</template>

<script lang="ts">
export default {
  props: ['bookImport', 'onContinue', 'onUpload'],
}
</script>

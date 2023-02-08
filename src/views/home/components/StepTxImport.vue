<script setup lang="ts">
import IconExchange from '~icons/material-symbols/compare-arrows'
import IconUpdated from '~icons/material-symbols/update-rounded'
import IconBulb from '~icons/material-symbols/lightbulb'

import { getDateTime } from '~/utils/time'
</script>

<template>
  <div class="flex gap-4">
    <template v-if="txImport.last">
      <div class="flex-grow shrink-0">
        <h2 class="text-xl font-bold mb-4">
          Use latest import
        </h2>
        <div class="card mx-auto w-96 bg-gray-700 text-slate-300 shadow-xl">
          <div class="card-body p-6 text-left">
            <span>
              <IconExchange class="inline-block" />
              {{ txImport.last.count }} transactions
            </span>
            <span v-if="txImport.last.lastModified">
              <IconUpdated class="inline-block" />
              updated at {{ getDateTime(txImport.last.lastModified) }}
            </span>
            <div class="card-actions justify-center">
              <button
                @click="onImportLatest"
                class="btn btn-sm btn-outline btn-secondary mt-2">
                Import
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="divider divider-horizontal">OR</div>
    </template>
    <div class="flex-grow shrink-0">
      <h2 class="text-xl font-bold mb-4">
        Upload transactions (CSV)
      </h2>
      <DropFile @upload="onUpload" />
      <p class="mt-4 text-orange-400 font-light">
        <IconBulb />
        Get export of transactions from LibraryCat
        <a
          class="link link-primary"
          href="https://www.librarycat.org/admin/transactions"
          target="_blank"
          rel="noopener noreferrer">here</a>.
      </p>
      <template v-if="txImport.status === 'loading'">
        <div class="radial-progress animate-spin text-gray-300 mt-4" style="--value:90;"></div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  props: ['txImport', 'onImportLatest', 'onUpload'],
}
</script>

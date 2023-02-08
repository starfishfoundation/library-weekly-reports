<script setup lang="ts">
import IconExchange from '~icons/material-symbols/compare-arrows'
import IconUpdated from '~icons/material-symbols/update-rounded'
import IconBulb from '~icons/material-symbols/lightbulb'

import { getDateTime } from '~/utils/time'
</script>

<template>
  <div class="flex gap-4">
    <template v-if="txImport.last">
      <div class="shrink-0 grow">
        <h2 class="mb-4 text-xl font-bold">
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
                class="btn-outline btn-secondary btn-sm btn mt-2"
                @click="onImportLatest"
              >
                Import
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="divider divider-horizontal">
        OR
      </div>
    </template>
    <div class="shrink-0 grow">
      <h2 class="mb-4 text-xl font-bold">
        Upload transactions (CSV)
      </h2>
        <br />
        (make sure to select "<strong class="font-bold">All</strong>" from the left sidebar!)
      <DropFile @upload="onUpload" />
      <p class="mt-4 font-light text-orange-400">
        <IconBulb />
        Get export of transactions from LibraryCat
        <a
          class="link-primary link"
          href="https://www.librarycat.org/admin/transactions"
          target="_blank"
          rel="noopener noreferrer"
        >here</a>.
      </p>
      <template v-if="txImport.status === 'loading'">
        <div class="radial-progress mt-4 animate-spin text-gray-300" style="--value:90;" />
      </template>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  props: ['txImport', 'onImportLatest', 'onUpload'],
}
</script>

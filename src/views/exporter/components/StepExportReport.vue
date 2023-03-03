<script setup lang="ts">
import IconCheck from '~icons/material-symbols/check-circle-rounded'

import { tableToHtml, transpose } from '~/utils/spreadsheet'
</script>

<template>
  <div class="items-center">
    <h2 class="mb-4 text-xl font-bold">
      Instructions
    </h2>
    <ol class="mb-8 list-decimal text-left">
      <li>Open the weekly report spreadsheet.</li>
      <li>Click the "Copy" button below.</li>
      <li>Paste the data in the spreadsheet.</li>
    </ol>
    <button
      class="btn-secondary btn-lg btn"
      @click="copyExcel"
    >
      Copy
      <div v-if="copyStatus === 'pending'" class="radial-progress ml-2 animate-spin" style="--size:1rem;--thickness:2px;--value:90;" />
      <IconCheck v-if="copyStatus === 'done'" class="ml-2 inline-block" />
    </button>
  </div>
</template>

<script lang="ts">
export default {
  props: ['report'],
  data() {
    return {
      copyStatus: null,
    }
  },
  computed: {
    reportAsExcel() {
      return tableToHtml(transpose(this.report))
    },
  },
  methods: {
    copyExcel() {
      this.copyStatus = 'pending'
      const blob = new Blob([this.reportAsExcel], { type: 'text/html' })
      setTimeout(() => {
        navigator.clipboard.write([
          new ClipboardItem({ [blob.type]: blob }),
        ])
        this.copyStatus = 'done'
      }, 3000)
    },
  },
}
</script>

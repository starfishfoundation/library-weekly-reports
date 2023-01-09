<script setup lang="ts">
import IconCheck from '~icons/material-symbols/check-circle-rounded'

import { transpose, tableToHtml } from '~/utils/spreadsheet'
import { getDateTime } from '~/utils/time'
</script>

<template>
  <div class="items-center">
    <button
      @click="copyExcel"
      class="btn btn-lg btn-secondary">
      Copy
      <IconCheck class="inline-block" v-if="copied" />
    </button>
  </div>
</template>

<script lang="ts">
export default {
  props: ['report'],
  data() {
    return {
      copied: false,
    }
  },
  methods: {
    copyExcel() {
      const blob = new Blob([this.reportAsExcel], { type: 'text/html' })
      setTimeout(() => {
        navigator.clipboard.write([
          new ClipboardItem({ [blob.type]: blob })
        ])
        this.copied = true
      }, 3000)
    }
  },
  computed: {
    reportAsExcel() {
      return tableToHtml(transpose(this.report))
    }
  },
}
</script>

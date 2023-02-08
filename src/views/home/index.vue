<script setup lang="ts">
import { importBooks, getExistingBookInfo } from '~/db/books'
import { importTransactions, getExistingTransactionInfo } from '~/db/transactions'
import { exportReport } from '~/db/exportReport'
import { ImportError } from '~/utils/errors'
import { getDate } from '~/utils/time'

import db from '~/db'
import DropFile from '~/components/DropFile.vue'
import StepBookImport from './components/StepBookImport.vue'
import StepTxImport from './components/StepTxImport.vue'
import StepDateFilter from './components/StepDateFilter.vue'
import StepExportReport from './components/StepExportReport.vue'
import appStore from '~/store'
</script>

<template>
  <div class="main">
    <ul class="steps shrink-0 mb-16">
      <li
        v-for="(label, stepId) in steps"
        :key="stepId"
        @click="() => setStep(stepId)"
        :class="`
          step
          ${isStepActive(stepId) ? 'step-primary' : ''}
          ${isStepAccessible(stepId) ? 'cursor-pointer' : 'cursor-not-allowed'}
        `">
        {{ label }}
      </li>
    </ul>

    <template v-if="step === 'bookImport'">
      <StepBookImport
        :bookImport="bookImport"
        :onImportLatest="finishBooks"
        :onUpload="handleUploadBooks"
        :onContinue="() => finishBooks(true)" />
    </template>

    <template v-if="step === 'txImport'">
      <StepTxImport
        :txImport="txImport"
        :onImportLatest="finishTxs"
        :onUpload="handleUploadTxs" />
    </template>

    <template v-if="step === 'dateFilter'">
      <StepDateFilter
        v-model:dateFrom="dateFilter.from"
        v-model:dateTo="dateFilter.to"
        :today="today"
        :onContinue="handleSubmitDateFilter" />
    </template>

    <template v-if="step === 'exportReport'">
      <StepExportReport
        :report="report"
        />
    </template>
  </div>
</template>

<script lang="ts">
export default {
  data() {
    const today = getDate(new Date())

    return {
      steps: {
        bookImport: 'Upload books',
        txImport: 'Upload transactions',
        dateFilter: 'Select dates',
        exportReport: 'Finish',
      },
      step: 'bookImport',
      bookImport: {
        status: '',
        last: null,
      },
      txImport: {
        status: '',
        errors: null,
        last: null,
      },
      today: today,
      dateFilter: {
        from: '',
        to: today,
      },
      report: null,
    };
  },
  async mounted() {
    window.dbConn = await db.getInstance()
    this.bookImport.last = await getExistingBookInfo()
    this.txImport.last = await getExistingTransactionInfo()
  },
  methods: {
    isStepAccessible(step) {
      switch (step) {
        case 'bookImport':
          return true
        case 'txImport':
          return this.bookImport.status === 'success'
        case 'dateFilter':
          return this.bookImport.status === 'success' && this.txImport.status === 'success'
        case 'exportReport':
          return (
            this.bookImport.status === 'success'
            && this.txImport.status === 'success'
            && this.dateFilter.from
            && this.dateFilter.to
          )
      }

      return false
    },
    isStepActive(step) {
      return Object.keys(this.steps).indexOf(step) <= Object.keys(this.steps).indexOf(this.step)
    },
    setStep(step) {
      if (!this.isStepAccessible(step)) {
        return
      }

      this.step = step
    },
    handleUploadBooks(file) {
      this.bookImport.status = 'loading'
      if (!file) {
        return
      }

      const reader = new FileReader()
      reader.addEventListener('load', async () => {
        await importBooks(reader.result, {
          lastModified: new Date(file.lastModified),
          onError: () => true,
        })
        // refresh last import so if we back to the step, we see updated info
        this.bookImport.last = await getExistingBookInfo()
        this.finishBooks()
      })
      reader.readAsText(file)
    },
    async finishBooks(force = false) {
      const conn = await db.getInstance()
      const books = await conn.select({
        from: 'Book',
      })
      if (force || !books.some(b => b.errors.length)) {
        this.bookImport.status = 'success'
        this.setStep('txImport')
      } else {
        this.bookImport.status = 'error'
      }
    },
    handleUploadTxs(file) {
      this.txImport.status = 'loading'
      if (!file) {
        return
      }

      const reader = new FileReader()
      reader.addEventListener('load', async () => {
        await importTransactions(reader.result, {
          lastModified: new Date(file.lastModified),
        })
        // refresh last import so if we back to the step, we see updated info
        this.txImport.last = await getExistingTransactionInfo()
        this.finishTxs()
      })
      reader.readAsText(file)
    },
    finishTxs(force = false) {
      this.txImport.status = 'success'
      this.setStep('dateFilter')
    },
    async handleSubmitDateFilter() {
      this.report = await exportReport({
        dateFrom: new Date(this.dateFilter.from),
        dateTo: new Date(this.dateFilter.to),
      })

      this.setStep('exportReport')
    },
  },
};
</script>

<style scoped></style>

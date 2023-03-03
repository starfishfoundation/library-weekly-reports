<script setup lang="ts">
import IconEdit from '~icons/material-symbols/edit-document-outline'
import IconError from '~icons/material-symbols/error-circle-rounded-outline'
import IconWarning from '~icons/material-symbols/warning-outline'

import db from '~/db'
</script>

<template>
  <div class="alert alert-error mt-8">
    <div>
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      <div class="text-left">
        <h3 class="font-bold">
          Errors when importing books
        </h3>
        <span>{{ errors.length }} errors found</span>
      </div>
    </div>
    <div class="flex-none">
      <button
        class="btn btn-sm btn-secondary"
        @click="$emit('continue')">
        Ignore & continue
      </button>
    </div>
  </div>
  <table class="table table-compact table-zebra mt-4">
    <thead>
      <tr>
        <th>#</th>
        <th>Book title</th>
        <th>Errors</th>
        <th>Edit</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in errorsPage" :key="item.bookId">
        <td>{{ currentPage * pageSize + index + 1 }}</td>
        <td v-html="item.title"></td>
        <td>
          <div v-for="err in item.errors" class="flex mb-2 last:mb-0">
            <template v-if="err.level === 'error'">
              <IconError class="text-red-400 mr-1" />
            </template>
            <template v-else-if="err.level === 'warning'">
              <IconWarning class="text-orange-300 mr-1" />
            </template>
            {{ err.message }}
          </div>
        </td>
        <td>
          <a
            :href="`https://www.librarything.com/work/edit/${item.bookId}`"
            title="Edit book in LibraryThing"
            rel="noopener noreferrer"
            target="_blank">
            <IconEdit />
          </a>
        </td>
      </tr>
    </tbody>
  </table>
  <div class="btn-group my-6">
    <button
      v-for="p in [...Array(Math.ceil(errors.length / pageSize))].keys()"
      :key="p"
      :class="`btn ${p === currentPage ? 'btn-active' : ''}`"
      @click="() => currentPage = p">
      {{ p + 1 }}
    </button>
  </div>
</template>

<script lang="ts">
export default {
  emits: ['continue'],
  data() {
    return {
      errors: [],
      pageSize: 400,
      currentPage: 0,
    }
  },
  async mounted() {
    const conn = await db.getInstance()
    const books = await conn.select({
      from: 'Book',
    })
    this.errors = books.filter(b => b.errors.length).map(b => ({
      bookId: b.id,
      title: b.title,
      errors: b.errors,
    }))
    this.errors.sort((a, b) => {
      return a.errors.map(e => e.message).join(' ').localeCompare(b.errors.map(e => e.message).join(' '))
    })
  },
  computed: {
    errorsPage() {
      return this.errors.slice(
        this.currentPage * this.pageSize,
        (this.currentPage + 1) * this.pageSize
      )
    },
  },
}
</script>

<style scoped>
.alert, table {
  width: 960px;
  max-width: 960px;
}

th, td {
  white-space: normal;
}

/* enlarge errors column */
thead th:nth-child(3) {
  width: 320px;
}
</style>
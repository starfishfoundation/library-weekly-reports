<script setup lang="ts">
import IconEdit from '~icons/material-symbols/edit-document-outline'
import IconError from '~icons/material-symbols/error-circle-rounded-outline'
import IconWarning from '~icons/material-symbols/warning-outline'

import db from '~/db'
</script>

<template>
  <div class="alert alert-error mt-8">
    <h3 class="font-bold">
      Errors when importing books
    </h3>
    {{ errors.length }} errors found
    <template v-if="errors.length > 100">
    , showing only first 1000.
    </template>
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
      <tr v-for="(item, index) in errors.slice(0, 1000)" :key="item.bookId">
        <td>{{ index + 1 }}</td>
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
</template>

<script lang="ts">
export default {
  data() {
    return {
      errors: [],
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
      return a.errors.join(' ').localeCompare(b.errors.join(' '))
    })
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
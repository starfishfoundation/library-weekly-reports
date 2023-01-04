<script setup>
import appStore from "~/store";

const options = {
  Language: ['Farsi', 'Arabic', 'Somali', 'French', 'English', 'German', 'Greek', 'Other'],
  Audience: ['Kids', 'Adults'],
  Topic: ['Fiction', 'Non fiction', 'Educational/sciences', 'Languages', 'Other'],
}
</script>

<template>
  <div>
    <h3 class="text-5xl font-bold">{{ draft && draft['Item Title'] }}</h3>
    <p class="mt-2 text-gray-500" v-if="formattedUpdatedAt">
      Last updated at: {{ formattedUpdatedAt }}
    </p>
    <div class="flex justify-center mt-8 font-black">
      <div
        v-for="field in ['Language', 'Audience', 'Topic']"
        :key="field"
        class="flex flex-col w-96 mr-3">
        <label
          v-for="option in options[field]"
          :key="option"
          class="bg-indigo-900 pl-8 py-3 text-left mb-1 cursor-pointer">
          <input
            type="radio"
            :name="field"
            :value="option"
            :checked="draft && option == draft[field]"
            class="mr-1"
            @change="evt => updateItem({ [field]: evt.target.value })" />
          {{ option }}
        </label>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['id'],
  data() {
    return {
      draft: null,
    };
  },
  mounted() {
    this.draft = {...appStore.books.books[this.id]}
  },
  methods: {
    updateItem(partial) {
      this.draft = {...this.draft, ...partial}
      appStore.books.updateBook(this.id, this.draft)
    }
  },
  computed: {
    formattedUpdatedAt() {
      if (!this.draft || !this.draft.updatedAt) {
        return ''
      }

      const d = new Date(this.draft.updatedAt)
      return d.toLocaleString()
    },
  }
};
</script>

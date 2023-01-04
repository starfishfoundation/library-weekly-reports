<script setup>
import BookClassifierItem from "./BookClassifierItem.vue";
</script>

<template>
  <div class="mt-32">
    <BookClassifierItem
      :key="bookIds[index]"
      :id="bookIds[index]" />
    <button class="btn-primary btn mt-8" @click="nextItem">
        Next
    </button>
  </div>
</template>

<script>
export default {
  props: ['bookIds'],
  data() {
    return {
      index: 0,
    };
  },
  methods: {
    nextItem() {
      if (this.index + 1 < this.bookIds.length) {
        this.index++
      }
    },
  },
};
</script>

<script lang="ts">
export default {
  props: ['dateFrom', 'dateTo', 'today', 'onContinue'],
  emits: ['update:dateFrom', 'update:dateTo'],
}
</script>

<template>
  <h2 class="mb-4 text-xl font-bold">
    Select date range for report
  </h2>
  <form @submit.prevent="onContinue">
    <fieldset class="flex gap-4">
      <div class="form-control w-96 max-w-xs">
        <label class="label">
          <span class="label-text">Date from:</span>
        </label>
        <input
          :value="dateFrom"
          :max="today"
          type="date"
          class="form-control input-bordered input h-auto w-full text-center"
          @input="$emit('update:dateFrom', $event.target.value)"
        >
      </div>
      <div class="form-control w-96 max-w-xs">
        <label class="label">
          <span class="label-text">Date to:</span>
        </label>
        <input
          :value="dateTo"
          :min="dateFrom"
          type="date"
          class="form-control input-bordered input h-auto w-full text-center"
          @input="$emit('update:dateTo', $event.target.value)"
        >
      </div>
    </fieldset>
    <button
      :disabled="!dateFrom || !dateTo"
      class="btn-secondary btn-wide btn mt-8"
      type="submit"
    >
      Submit
    </button>
  </form>
</template>

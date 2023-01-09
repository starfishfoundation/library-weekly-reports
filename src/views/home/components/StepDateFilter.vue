<template>
  <h2 class="text-xl font-bold mb-4">
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
          @input="$emit('update:dateFrom', $event.target.value)"
          :max="today"
          type="date"
          class="form-control input input-bordered w-full" />
      </div>
      <div class="form-control w-96 max-w-xs">
        <label class="label">
          <span class="label-text">Date to:</span>
        </label>
        <input
          :value="dateTo"
          @input="$emit('update:dateTo', $event.target.value)"
          :min="dateFrom"
          type="date"
          class="form-control input input-bordered w-full" />
      </div>
    </fieldset>
    <button
      :disabled="!dateFrom || !dateTo"
      class="btn btn-wide btn-secondary mt-8"
      type="submit">
      Submit
    </button>
  </form>
</template>

<script lang="ts">
export default {
  props: ['dateFrom', 'dateTo', 'today', 'onContinue'],
  emits: ['update:dateFrom', 'update:dateTo'],
}
</script>
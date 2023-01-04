<template>
  <div v-if="file" class="w-full">
      <button class="btn-secondary btn" @click="() => file = null">
      Select another file
      </button>
  </div>
  <div
    v-if="!file"
    class="dropzone-container"
    @dragover="dragover"
    @dragleave="dragleave"
    @drop="drop"
  >
    <input
      type="file"
      name="file"
      id="fileInput"
      class="hidden-input"
      @change="onChange"
      ref="file"
    />

    <label for="fileInput" class="file-label">
      <div v-if="isDragging">Release to drop files here.</div>
      <div v-else>Drop files here or <u>click here</u> to upload.</div>
    </label>
  </div>
</template>

<script>
export default {
  emits: ['upload'],
  data() {
    return {
      isDragging: false,
      file: null,
    };
  },
  methods: {
    onChange() {
      this.file = this.$refs.file.files[0];
      this.$emit('upload', this.file);
    },
    dragover(e) {
      e.preventDefault();
      this.isDragging = true;
    },
    dragleave() {
      this.isDragging = false;
    },
    drop(e) {
      e.preventDefault();
      this.$refs.file.files = e.dataTransfer.files;
      this.onChange();
      this.isDragging = false;
    },
  },
};
</script>

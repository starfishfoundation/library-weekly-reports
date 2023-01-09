<script setup lang="ts">
import Navbar from "./components/layout/Navbar/index.vue";
</script>

<template>
  <div class="antialiased">
    <div class="min-h-screen">
      <Navbar />
      <RouterView />
    </div>
  </div>
</template>

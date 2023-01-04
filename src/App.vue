<script setup lang="ts">
import { logLabeled } from "./utils/logger";
import Navbar from "./components/layout/Navbar/index.vue";
logLabeled("I'm ready!  ⸜(๑'ᵕ'๑)⸝⋆*", "log", "", "color: #66ccff");
</script>

<template>
  <div class="antialiased">
    <div class="min-h-screen">
      <Navbar />
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<template>
  <div
    class="sticky top-0 z-30 flex h-16 w-full justify-center text-base-content opacity-90 backdrop-blur transition-all duration-100"
  >
    <nav class="navbar w-full">
      <div class="flex flex-1 md:gap-1 lg:gap-2">
        <router-link
          to="/"
          aria-current="page"
          aria-label="Homepage"
          class="btn-ghost btn px-2"
        >
          <div
            class="inline-flex text-lg text-primary transition-all duration-200 md:text-3xl"
          >
            <span class="text-accent">L<span class="lowercase">ibrary</span></span>
            <span class="text-base-content">W<span class="lowercase">eekly</span></span>
            <span class="text-base-content">R<span class="lowercase">eports</span></span>
          </div>
        </router-link>
      </div>
    </nav>
  </div>
</template>

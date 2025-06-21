<template>
  <div
    v-if="error && typeof error.message === 'object'"
    class="small text-danger px-3 mt-3"
  >
    <ul class="list-unstyled">
      <li v-for="error in error.message" :key="error">{{ error }}</li>
    </ul>
  </div>
  <div
    v-else-if="error && typeof error.message === 'string'"
    class="small text-danger px-3 mt-3"
  >
    {{ error.message }}
  </div>
</template>

<script setup lang="ts">
import { type HttpException } from "../types/http";

defineProps<{ error: HttpException }>();
</script>

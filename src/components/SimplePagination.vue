<template>
  <div class="d-flex justify-content-end">
    <button
      type="button"
      class="btn btn-link text-primary-dark"
      @click="loadMoreTasks"
      :disabled="store.disabledPagination"
    >
      Ver más
    </button>
  </div>
</template>

<script setup lang="ts">
import { useTasksStore } from "../store/tasks";
const store = useTasksStore();

function loadMoreTasks() {
  store.loadMoreTasks();
}
</script>

<template>
  <!-- Task Item -->
  <template v-if="store.loadingTasks">Loading...</template>
  <template v-else>
    <div class="d-flex flex-column gap-2" v-for="task in tasks" :key="task.id">
      <TaskItem :task="task" :tab="store.tab" />
    </div>
    <SimplePagination v-if="tasks.length > 0" />
    <template v-else>No hay tareas</template>
  </template>

  <!-- Repeat for other tasks -->
  <!-- <div
    class="d-flex justify-content-between align-items-start bg-white p-3 mb-2 rounded"
  >
    <div class="flex-grow-1">
      <p class="fw-medium m-0 text-primary-dark">Prepare presentation</p>
      <p class="text-muted-blue small m-0">Due: 2024-07-22</p>
      <p class="text-muted-blue small m-0">
        Prepare presentation for the team meeting
      </p>
    </div>
    <div
      class="text-primary-dark d-flex align-items-center justify-content-center"
      style="width: 28px; height: 28px"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="currentColor"
        viewBox="0 0 256 256"
      >
        <path d="..."></path>
      </svg>
    </div>
  </div> -->

  <!-- <div
    class="d-flex justify-content-between align-items-start bg-white p-3 mb-2 rounded"
  >
    <div class="flex-grow-1">
      <p class="fw-medium m-0 text-primary-dark">Book dinner reservation</p>
      <p class="text-muted-blue small m-0">Due: 2024-07-25</p>
      <p class="text-muted-blue small m-0">Book a table for dinner</p>
    </div>
    <div
      class="text-primary-dark d-flex align-items-center justify-content-center"
      style="width: 28px; height: 28px"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="currentColor"
        viewBox="0 0 256 256"
      >
        <path d="..."></path>
      </svg>
    </div>
  </div> -->
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useTasksStore } from "@/store/tasks";
import TaskItem from "./TaskItem.vue";
import SimplePagination from "@/components/SimplePagination.vue";
const store = useTasksStore();
const tasks = computed(() => store.tasks);

onMounted(async () => {
  const url = new URL(window.location.href);
  store.setTab(url.searchParams.get("tab") || "pending");
  await Promise.all([store.getTasksCounts(), store.refreshTasks()]);
});
</script>

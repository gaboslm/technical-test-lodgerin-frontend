<template>
  <div class="pb-3">
    <ul
      class="nav d-flex border-bottom px-3 gap-4"
      style="border-color: #cedbe8"
    >
      <li
        @click="changeTab('pending')"
        class="nav-item text-decoration-none border-bottom border-3 border-primary-dark py-3"
        :class="{ 'border-primary': store.tab === 'pending' }"
      >
        <div class="position-relative">
          <span
            class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
          >
            {{ store.totalPendingTasks }}
            <span class="visually-hidden">pending tasks</span>
          </span>

          <p
            class="nav-link fw-bold small m-0"
            :class="
              store.tab === TasksStatus.PENDING.toLowerCase()
                ? 'text-primary'
                : 'text-secondary'
            "
          >
            Pendientes
          </p>
        </div>
      </li>
      <li
        @click="changeTab(TasksStatus.COMPLETED.toLowerCase())"
        class="nav-item text-decoration-none border-bottom border-3 border-transparent py-3"
        :class="{
          'border-primary': store.tab === TasksStatus.COMPLETED.toLowerCase(),
        }"
      >
        <div class="position-relative">
          <span
            class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
          >
            {{ store.totalCompletedTasks }}
            <span class="visually-hidden">completed tasks</span>
          </span>
          <p
            class="nav-link fw-bold small m-0"
            :class="
              store.tab === TasksStatus.COMPLETED.toLowerCase()
                ? 'text-primary'
                : 'text-secondary'
            "
          >
            Completadas
          </p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useTasksStore } from "@/store/tasks";
import { TasksStatus } from "@/types/task";
const store = useTasksStore();

function changeTab(value: string) {
  store.setTab(value);
  store.refreshTasks();
  const url = new URL(window.location.href);
  url.searchParams.set("tab", value);
  window.history.pushState(null, "", url);
}
</script>

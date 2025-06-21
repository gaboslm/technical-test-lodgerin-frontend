<template>
  <div
    ref="li"
    class="d-flex justify-content-between align-items-start gap-2 bg-white p-3 mb-2 rounded"
  >
    <template v-if="task.status === TasksStatus.COMPLETED">
      <input
        class="form-check-input"
        type="checkbox"
        checked
        value=""
        id="checkNativeSwitch"
        switch
        @change="updateTaskStatus(TasksStatus.PENDING)"
      />
    </template>
    <template v-else>
      <input
        class="form-check-input"
        type="checkbox"
        value=""
        id="checkNativeSwitch"
        switch
        @change="updateTaskStatus(TasksStatus.COMPLETED)"
      />
    </template>
    <div class="flex-grow-1">
      <p
        class="fw-medium m-0 text-primary-dark"
        :class="{
          'text-decoration-line-through': task.status === TasksStatus.COMPLETED,
        }"
      >
        {{ task.title }}
      </p>
      <p v-if="tab === 'pending'" class="text-muted-blue small m-0">
        Expira:
        {{ dayjs(task.expirationDate).utc().format("DD MMM YYYY") }}
        ({{ humanizeDuration(task.expirationDate) }})
      </p>
      <p class="text-muted-blue small m-0">{{ task.description }}</p>
    </div>
    <!-- {{ task.status }} -->
    <button
      type="button"
      class="btn btn-primary bg-transparent text-primary d-flex align-items-center gap-1 rounded-4"
      data-bs-toggle="modal"
      data-bs-target="#modalEditTask"
      @click="getTaskById(task.id)"
    >
      <PencilLine :size="20" />
      <span class="animated-label">Editar</span>
    </button>
    <button
      type="button"
      class="btn btn-danger d-flex align-items-center gap-1 rounded-4"
      @click="removeTask"
    >
      <X :size="20" />
      <span class="animated-label">Eliminar</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import dayjs from "../../../lib/dayjs";
import { useTasksStore } from "../../../store/tasks";
import { TasksStatus } from "../../../types/task";
import { PencilLine, X } from "lucide-vue-next";
import { type Task } from "../../../types/task";

const props = defineProps<{ task: Task; tab: string }>();

const store = useTasksStore();
const today = ref(dayjs());
const li = ref<HTMLDivElement>({} as HTMLDivElement);

function humanizeDuration(date: string) {
  const humanized = dayjs(date)
    .utc()
    .startOf("day")
    .from(today.value.startOf("day"));
  return humanized;
}

async function getTaskById(id: string) {
  store.setTaskId(id);
  await store.getTaskById(id);
}

function updateTaskStatus(status: string) {
  setTimeout(() => {
    // Add animation class
    if (status === TasksStatus.COMPLETED)
      li.value.classList.add("slide-out-right");
    if (status === TasksStatus.PENDING)
      li.value.classList.add("slide-out-left");

    // Wait for animation to finish (0.5s in this case)
    li.value.addEventListener("animationend", () => {
      store.updateTaskStatus(props.task.id, status);
      store.recalculatePagination = true;
    });
  }, 300);
}

function removeTask() {
  setTimeout(() => {
    // Add animation class
    li.value.classList.add("slide-out-right");

    // Wait for animation to finish (0.5s in this case)
    li.value.addEventListener("animationend", () => {
      store.removeTask(props.task.id);
      store.recalculatePagination = true;
    });
  }, 300);
}
</script>

<style lang="scss"></style>

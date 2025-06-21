<template>
  <main class="py-5 flex-grow-1">
    <div class="container">
      <div class="mx-auto" style="max-width: 960px">
        <!-- Header -->
        <div class="d-flex flex-wrap justify-content-between gap-3 p-3">
          <div class="d-flex flex-column gap-2 min-w-100">
            <p class="fs-2 fw-bold text-primary-dark m-0">📚 Mis tareas</p>
            <p class="text-muted-blue m-0">
              Gestiona tus tareas de manera eficiente.
            </p>
          </div>
          <div class="d-flex align-items-center gap-2">
            <button
              type="button"
              class="btn btn-primary d-flex align-items-center gap-1 rounded-4"
              data-bs-toggle="modal"
              data-bs-target="#modalCreateTask"
            >
              <Plus :size="20" />
              <span class="animated-label">Añadir</span>
            </button>
          </div>
        </div>

        <!-- Tabs -->
        <Tabs />

        <!-- List -->
        <TasksList />
      </div>
    </div>
    <!-- Modal create task -->
    <ModalCreateTask />
    <!-- Modal edit task -->
    <ModalEditTask />
  </main>
</template>

<script setup lang="ts">
import { Plus } from "lucide-vue-next";
import Tabs from "./Tabs.vue";
import TasksList from "../components/TasksList.vue";
import ModalCreateTask from "../partials/ModalCreateTask.vue";
import ModalEditTask from "../partials/ModalEditTask.vue";
</script>

<style lang="scss"></style>

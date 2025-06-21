<template>
  <!-- Modal -->
  <div
    class="modal fade"
    id="modalCreateTask"
    tabindex="-1"
    aria-labelledby="modalCreateTaskLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content rounded-5">
        <div class="modal-header px-4">
          <h1
            class="modal-title fw-bold fs-5 d-flex align-items-center gap-2"
            id="modalCreateTaskLabel"
          >
            <span>✍🏻</span>
            <span>Nueva tarea</span>
          </h1>
          <button
            ref="closeModalButton"
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body px-5">
          <form
            id="formCreateTask"
            class="d-flex flex-column gap-2"
            @submit.prevent="createTask"
          >
            <div>
              <label class="form-label fw-semibold small" for="title"
                >Titulo</label
              >
              <input
                class="form-control form-control-lg rounded-4"
                type="text"
                required
                v-model="formData.title"
              />
            </div>
            <div>
              <label class="form-label fw-semibold small" for="description">
                Descripción
                <span class="fw-normal text-muted small"> (opcional) </span>
              </label>
              <textarea
                class="form-control form-control-lg rounded-4"
                type="text"
                rows="3"
                v-model="formData.description"
              />
            </div>
            <div>
              <label class="form-label fw-semibold small" for="expirationDate"
                >Fecha de expiración</label
              >
              <input
                class="form-control rounded-4"
                type="date"
                required
                v-model="formData.expirationDate"
              />
            </div>
          </form>
          <ServerErrors :error="error" />
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary d-flex align-items-center gap-1 rounded-4"
            data-bs-dismiss="modal"
          >
            <ArrowLeft :size="20" />
            <span class="animated-label">Cancelar</span>
          </button>
          <button
            type="submit"
            form="formCreateTask"
            class="btn btn-primary d-flex align-items-center gap-1 rounded-4"
            :disabled="store.loadingCreatingTask"
            @click="store.loadingCreatingTask && $event.stopPropagation()"
          >
            <template v-if="!store.loadingCreatingTask">
              <Check :size="20" />
              <span>Guardar</span>
            </template>
            <template v-else>
              <Loader2 :size="20" class="spin" />
              <span>Guardando...</span>
            </template>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useTasksStore } from "../../../store/tasks";
import { type HttpException } from "../../../types/http";
import { Check, ArrowLeft, Loader2 } from "lucide-vue-next";
import ServerErrors from "../../../components/ServerErrors.vue";

const closeModalButton = ref<HTMLButtonElement | undefined>();
const error = ref<HttpException>({} as HttpException);
const store = useTasksStore();
const formData = reactive({
  title: "",
  description: "",
  expirationDate: "",
});

async function createTask() {
  const result = await store.addTask({
    title: formData.title,
    description: formData.description,
    expirationDate: formData.expirationDate,
  });

  if (typeof result === "boolean") {
    closeModalButton.value?.click();
    formData.title = "";
    formData.description = "";
    formData.expirationDate = "";
    error.value = {} as HttpException;
  } else {
    error.value = result;
  }
}
</script>

<style lang="scss"></style>

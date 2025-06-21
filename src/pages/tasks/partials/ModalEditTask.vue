<template>
  <!-- Modal -->
  <div
    class="modal fade"
    id="modalEditTask"
    tabindex="-1"
    aria-labelledby="modalEditTaskLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content rounded-5">
        <div class="modal-header px-4">
          <h1
            class="modal-title fw-bold fs-5 d-flex align-items-center gap-2"
            id="modalEditTaskLabel"
          >
            <span>✍🏻</span>
            <span>Editar tarea</span>
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
            id="formEditTask"
            class="d-flex flex-column gap-2"
            @submit.prevent="updateTask"
            novalidate
          >
            <div>
              <label class="form-label fw-semibold small" for="title"
                >Titulo</label
              >
              <input
                v-model="formData.title"
                class="form-control form-control-lg rounded-4"
                type="text"
                name="title"
              />
            </div>
            <div>
              <label class="form-label fw-semibold small" for="description">
                Descripción
                <span class="fw-normal text-muted small"> (opcional) </span>
              </label>
              <textarea
                v-model="formData.description"
                class="form-control form-control-lg rounded-4"
                type="text"
                name="description"
                rows="3"
              />
            </div>
            <div>
              <label class="form-label fw-semibold small" for="expirationDate"
                >Fecha de expiración</label
              >
              <input
                v-model="formData.expirationDate"
                class="form-control rounded-4"
                type="date"
                name="expirationDate"
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
            <ArrowLeft size="20" />
            <span class="animated-label">Cancelar</span>
          </button>
          <button
            type="submit"
            form="formEditTask"
            class="btn btn-primary d-flex align-items-center gap-1 rounded-4"
            :disabled="store.loadingUpdatingTask"
            @click="store.loadingUpdatingTask && $event.stopPropagation()"
          >
            <template v-if="!store.loadingUpdatingTask">
              <Check size="20" />
              <span>Guardar</span>
            </template>
            <template v-else>
              <Loader2 size="20" class="spin" />
              <span>Guardando...</span>
            </template>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch, computed } from "vue";
import { useTasksStore } from "@/store/tasks";
import { type HttpException } from "@/types/http";
import { PencilLine, ArrowLeft, Check, Loader2 } from "lucide-vue-next";
import ServerErrors from "@/components/ServerErrors.vue";
import dayjs from "@/lib/dayjs";

const closeModalButton = ref<HTMLButtonElement>();
const error = ref<HttpException>({} as HttpException);
const store = useTasksStore();

const formData = reactive({
  title: "",
  description: "",
  expirationDate: "",
});

const task = computed(() => store.task);

watch(task, () => {
  formData.title = task.value.title;
  formData.description = task.value.description;
  formData.expirationDate = dayjs(task.value.expirationDate)
    .utc()
    .format("YYYY-MM-DD");
});

async function updateTask() {
  const result = await store.updateTask({ id: store.taskId, ...formData });

  if (typeof result === "boolean") {
    closeModalButton.value?.click();
    formData.title = "";
    formData.description = "";
    formData.expirationDate = null;
    error.value = [];
  } else {
    error.value = result;
  }
}
</script>

<style lang="scss"></style>

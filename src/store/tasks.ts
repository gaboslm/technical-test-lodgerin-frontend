import { defineStore } from "pinia";
import axios from "../lib/axios";
import type { MetaPagination } from "../types/http";
import { TasksStatus, type Task } from "../types/task";
import type { HttpException } from "../types/http";

const defaultPagination = { page: 1, pageSize: 10 };

export const useTasksStore = defineStore("tasks", {
  state: () => ({
    tab: "pending",
    taskId: undefined as string | undefined,
    task: {} as Task,
    tasks: [] as Task[],
    loadingTasks: false,
    metaTasks: {} as MetaPagination,
    totalPendingTasks: 0,
    totalCompletedTasks: 0,
    loadingCreatingTask: false,
    loadingUpdatingTask: false,
    disabledPagination: false,
    recalculatePagination: false,
  }),
  actions: {
    setTab(tab: string) {
      this.tab = tab;
    },
    setTaskId(id: string) {
      this.taskId = id;
    },
    async getTaskById(id: string): Promise<void> {
      try {
        const { data } = await axios.get(`/tasks/${id}`);
        this.task = data;
      } catch (error: any) {
        console.log(error?.message);
      }
    },
    async getTasks(
      pagination: { page: number; pageSize: number } = defaultPagination,
      filter: { status: string } = { status: "pending" }
    ) {
      this.loadingTasks = true;
      const { data } = await axios.get("/tasks", {
        params: {
          page: pagination.page,
          pageSize: pagination.pageSize,
          status: filter.status.toUpperCase(),
        },
      });
      this.tasks = data.data;
      this.metaTasks = data.meta;
      this.loadingTasks = false;
      this.verifyPagination(data);
    },
    async getTasksCounts() {
      const { data } = await axios.get("/tasks/counts");
      this.totalPendingTasks = data.totalPendingTasks;
      this.totalCompletedTasks = data.totalCompletedTasks;
    },
    async verifyPagination(data: { data: Task[]; meta: MetaPagination }) {
      this.disabledPagination = data.meta.currentPage === data.meta.totalPages;
    },
    async loadMoreTasks() {
      if (this.recalculatePagination) {
        this.recalculatePagination = false;
        this.refreshTasks();
        return;
      }
      const { data } = await axios.get("/tasks", {
        params: {
          page: this.metaTasks.currentPage + 1,
          pageSize: this.metaTasks.pageSize,
          status: this.tab.toUpperCase(),
        },
      });
      this.tasks.push(...data.data);
      this.metaTasks = data.meta;
      this.verifyPagination(data);
    },
    async addTask(task: Task): Promise<boolean | HttpException> {
      let result: boolean | HttpException;
      try {
        this.loadingCreatingTask = true;
        const { status } = await axios.post("/tasks", task);
        if (status === 201) {
          await Promise.all([this.getTasksCounts(), this.refreshTasks()]);
          result = true;
        } else {
          result = false;
        }
      } catch (error: any) {
        result = error?.response?.data as HttpException;
      } finally {
        this.loadingCreatingTask = false;
      }
      return result;
    },
    async updateTask({ id, ...task }: Task) {
      let result: boolean | HttpException;
      let taskIndex = this.tasks.findIndex((t) => t.id === id);
      let lastTask = this.tasks[taskIndex];
      try {
        this.loadingUpdatingTask = true;
        const { status } = await axios.put(`/tasks/${id}`, task);
        if (status === 200) {
          // optimistic update
          this.tasks[taskIndex] = { id: lastTask.id, ...task };
          result = true;
        } else {
          // rollback optimistic update
          this.tasks[taskIndex] = lastTask;
          result = false;
        }
      } catch (error: any) {
        result = error?.response?.data as HttpException;
      } finally {
        this.loadingUpdatingTask = false;
      }
      return result;
    },
    async updateTaskStatus(id: string, status: string) {
      // optimistic update
      const taskIndex = this.tasks.findIndex((task) => task.id === id);
      const task = this.tasks[taskIndex];
      if (status === TasksStatus.COMPLETED) {
        this.totalPendingTasks--;
        this.totalCompletedTasks++;
      }
      if (status === TasksStatus.PENDING) {
        this.totalCompletedTasks--;
        this.totalPendingTasks++;
      }
      this.tasks.splice(taskIndex, 1);

      try {
        await axios.put(`/tasks/${id}`, {
          status,
        });
      } catch (error) {
        // rollback optimistic update
        this.tasks.splice(taskIndex, 0, task as Task);
        if (status === TasksStatus.COMPLETED) {
          this.totalPendingTasks++;
          this.totalCompletedTasks--;
        }
        if (status === TasksStatus.PENDING) {
          this.totalCompletedTasks++;
          this.totalPendingTasks--;
        }
      }
    },
    async removeTask(id: string) {
      // optimistic update
      const task = this.tasks.find((task) => task.id === id);
      const taskIndex = this.tasks.findIndex((task) => task.id === id);
      if (task?.status === TasksStatus.COMPLETED) {
        this.totalCompletedTasks--;
      }
      if (task?.status === TasksStatus.PENDING) {
        this.totalPendingTasks--;
      }
      this.tasks.splice(taskIndex, 1);

      try {
        await axios.delete(`/tasks/${id}`);
        await this.getTasksCounts();
      } catch (error) {
        // rollback optimistic update
        this.tasks.splice(taskIndex, 0, task as Task);
        if (task?.status === TasksStatus.COMPLETED) {
          this.totalCompletedTasks++;
        }
        if (task?.status === TasksStatus.PENDING) {
          this.totalPendingTasks++;
        }
      }
    },
    async refreshTasks(
      pagination: { page: number; pageSize: number } = defaultPagination
    ) {
      this.getTasks(pagination, { status: this.tab });
    },
  },
});

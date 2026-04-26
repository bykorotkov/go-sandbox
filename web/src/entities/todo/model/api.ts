import { apiClient } from "../../../shared/api/client";
import type { Todo } from "./types";

interface CreateTodoRequest {
  title: string;
}

export function getTodos(): Promise<Todo[]> {
  return apiClient.get<Todo[] | null>("/todos").then((todos) => todos ?? []);
}

export function createTodo(title: string): Promise<Todo> {
  const payload: CreateTodoRequest = { title };
  return apiClient.post<Todo, CreateTodoRequest>("/todos", payload);
}

export function completeTodo(id: number): Promise<Todo> {
  return apiClient.patch<Todo>(`/todos/${id}/complete`);
}

export function deleteTodo(id: number): Promise<void> {
  return apiClient.delete(`/todos/${id}`);
}

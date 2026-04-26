import { useEffect, useMemo, useState } from "react";
import { AddTodoForm } from "../../../features/add-todo";
import {
  completeTodo as completeTodoRequest,
  createTodo as createTodoRequest,
  deleteTodo as deleteTodoRequest,
  getTodos,
} from "../../../entities/todo/model/api";
import { TodoList } from "../../../widgets/todo-list";
import type { Todo } from "../../../entities/todo/model/types";
import { toErrorMessage } from "../../../shared/lib/errors";

export function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState("");

  const completedCount = useMemo(
    () => todos.filter((todo) => todo.completed).length,
    [todos]
  );

  const loadTodos = async () => {
    setError("");
    setIsLoading(true);
    try {
      const data = await getTodos();
      setTodos(data);
    } catch (err: unknown) {
      setError(toErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const runMutation = async (action: () => Promise<unknown>): Promise<void> => {
    setError("");
    setIsMutating(true);
    try {
      await action();
      await loadTodos();
    } catch (err: unknown) {
      setError(toErrorMessage(err));
      setIsLoading(false);
    } finally {
      setIsMutating(false);
    }
  };

  return (
    <main className="page">
      <section className="card">
        <header className="header">
          <h1>Todo List</h1>
          <p>
            Всего: <strong>{todos.length}</strong> · Завершено:{" "}
            <strong>{completedCount}</strong>
          </p>
        </header>

        <AddTodoForm
          disabled={isMutating}
          onSubmit={(title) => runMutation(() => createTodoRequest(title))}
        />

        {error && <p className="error-text">{error}</p>}
        {isLoading ? (
          <p className="loading-text">Загрузка...</p>
        ) : (
          <TodoList
            todos={todos}
            busy={isMutating}
            onComplete={(id) => runMutation(() => completeTodoRequest(id))}
            onDelete={(id) => runMutation(() => deleteTodoRequest(id))}
          />
        )}
      </section>
    </main>
  );
}

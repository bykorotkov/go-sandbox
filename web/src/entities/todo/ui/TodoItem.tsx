import { CompleteTodoButton } from "../../../features/complete-todo";
import { DeleteTodoButton } from "../../../features/delete-todo";
import type { Todo } from "../model/types";

interface TodoItemProps {
  todo: Todo;
  onComplete: (id: number) => void;
  onDelete: (id: number) => void;
  busy: boolean;
}

export function TodoItem({ todo, onComplete, onDelete, busy }: TodoItemProps) {
  return (
    <li className="todo-item">
      <div className="todo-main">
        <p className={`todo-title ${todo.completed ? "done" : ""}`}>{todo.title}</p>
        <span className="todo-meta">
          #{todo.id} · {new Date(todo.created_at).toLocaleString("ru-RU")}
        </span>
      </div>
      <div className="todo-actions">
        {!todo.completed && (
          <CompleteTodoButton disabled={busy} onClick={() => onComplete(todo.id)} />
        )}
        <DeleteTodoButton disabled={busy} onClick={() => onDelete(todo.id)} />
      </div>
    </li>
  );
}

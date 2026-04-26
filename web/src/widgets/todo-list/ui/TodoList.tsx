import { TodoItem } from "../../../entities/todo/ui/TodoItem";
import type { Todo } from "../../../entities/todo/model/types";

interface TodoListProps {
  todos: Todo[];
  onComplete: (id: number) => void;
  onDelete: (id: number) => void;
  busy: boolean;
}

export function TodoList({ todos, onComplete, onDelete, busy }: TodoListProps) {
  if (todos.length === 0) {
    return <p className="empty-state">Список пуст. Добавьте первую задачу.</p>;
  }

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onComplete={onComplete}
          onDelete={onDelete}
          busy={busy}
        />
      ))}
    </ul>
  );
}

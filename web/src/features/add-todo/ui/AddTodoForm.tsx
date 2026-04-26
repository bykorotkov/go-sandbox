import { type FormEvent, useState } from "react";

interface AddTodoFormProps {
  onSubmit: (title: string) => Promise<void>;
  disabled: boolean;
}

export function AddTodoForm({ onSubmit, disabled }: AddTodoFormProps) {
  const [title, setTitle] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) {
      return;
    }
    await onSubmit(trimmed);
    setTitle("");
  };

  return (
    <form className="add-todo-form" onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        className="todo-input"
        placeholder="Например: Подготовить отчёт"
        disabled={disabled}
      />
      <button type="submit" className="btn btn-primary" disabled={disabled}>
        Добавить
      </button>
    </form>
  );
}

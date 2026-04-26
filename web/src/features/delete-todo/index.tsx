interface DeleteTodoButtonProps {
  onClick: () => void;
  disabled: boolean;
}

export function DeleteTodoButton({ onClick, disabled }: DeleteTodoButtonProps) {
  return (
    <button type="button" className="btn btn-danger" onClick={onClick} disabled={disabled}>
      Удалить
    </button>
  );
}

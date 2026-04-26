interface CompleteTodoButtonProps {
  onClick: () => void;
  disabled: boolean;
}

export function CompleteTodoButton({ onClick, disabled }: CompleteTodoButtonProps) {
  return (
    <button type="button" className="btn btn-success" onClick={onClick} disabled={disabled}>
      Завершить
    </button>
  );
}

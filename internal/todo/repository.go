package todo

import (
	"context"
	"errors"
	"strings"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

var ErrTodoNotFound = errors.New("todo not found")

type Repository struct {
	pool *pgxpool.Pool
}

func NewRepository(pool *pgxpool.Pool) *Repository {
	return &Repository{pool: pool}
}

func (r *Repository) Create(ctx context.Context, title string) (Todo, error) {
	title = strings.TrimSpace(title)
	const query = `
INSERT INTO todos (title)
VALUES ($1)
RETURNING id, title, completed, created_at;`

	var item Todo
	err := r.pool.QueryRow(ctx, query, title).Scan(
		&item.ID,
		&item.Title,
		&item.Completed,
		&item.CreatedAt,
	)
	return item, err
}

func (r *Repository) List(ctx context.Context) ([]Todo, error) {
	const query = `
SELECT id, title, completed, created_at
FROM todos
ORDER BY id DESC;`

	rows, err := r.pool.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	todos := make([]Todo, 0)
	for rows.Next() {
		var item Todo
		if err := rows.Scan(&item.ID, &item.Title, &item.Completed, &item.CreatedAt); err != nil {
			return nil, err
		}
		todos = append(todos, item)
	}

	return todos, rows.Err()
}

func (r *Repository) Delete(ctx context.Context, id int64) error {
	const query = `DELETE FROM todos WHERE id = $1;`
	cmd, err := r.pool.Exec(ctx, query, id)
	if err != nil {
		return err
	}
	if cmd.RowsAffected() == 0 {
		return ErrTodoNotFound
	}
	return nil
}

func (r *Repository) Complete(ctx context.Context, id int64) (Todo, error) {
	const query = `
UPDATE todos
SET completed = true
WHERE id = $1
RETURNING id, title, completed, created_at;`

	var item Todo
	err := r.pool.QueryRow(ctx, query, id).Scan(
		&item.ID,
		&item.Title,
		&item.Completed,
		&item.CreatedAt,
	)
	if errors.Is(err, pgx.ErrNoRows) {
		return Todo{}, ErrTodoNotFound
	}
	return item, err
}

package http

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/igor/todo-list/internal/todo"
)

type Handler struct {
	repo *todo.Repository
}

func NewHandler(repo *todo.Repository) *Handler {
	return &Handler{repo: repo}
}

type createTodoRequest struct {
	Title string `json:"title"`
}

func (h *Handler) CreateTodo(w http.ResponseWriter, r *http.Request) {
	var req createTodoRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "invalid json body")
		return
	}
	if strings.TrimSpace(req.Title) == "" {
		writeError(w, http.StatusBadRequest, "title is required")
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	item, err := h.repo.Create(ctx, req.Title)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to create todo")
		return
	}

	writeJSON(w, http.StatusCreated, item)
}

func (h *Handler) ListTodos(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	items, err := h.repo.List(ctx)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to get todos")
		return
	}

	writeJSON(w, http.StatusOK, items)
}

func (h *Handler) DeleteTodo(w http.ResponseWriter, r *http.Request) {
	id, ok := todoIDFromPath(r.URL.Path, "/todos/")
	if !ok {
		writeError(w, http.StatusBadRequest, "invalid todo id")
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	err := h.repo.Delete(ctx, id)
	if errors.Is(err, todo.ErrTodoNotFound) {
		writeError(w, http.StatusNotFound, "todo not found")
		return
	}
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to delete todo")
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (h *Handler) CompleteTodo(w http.ResponseWriter, r *http.Request) {
	id, ok := todoIDFromPath(r.URL.Path, "/todos/")
	if !ok {
		writeError(w, http.StatusBadRequest, "invalid todo id")
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	item, err := h.repo.Complete(ctx, id)
	if errors.Is(err, todo.ErrTodoNotFound) {
		writeError(w, http.StatusNotFound, "todo not found")
		return
	}
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to complete todo")
		return
	}

	writeJSON(w, http.StatusOK, item)
}

func writeJSON(w http.ResponseWriter, statusCode int, payload any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	_ = json.NewEncoder(w).Encode(payload)
}

func writeError(w http.ResponseWriter, statusCode int, message string) {
	writeJSON(w, statusCode, map[string]string{
		"error": message,
	})
}

func todoIDFromPath(path, prefix string) (int64, bool) {
	path = strings.TrimPrefix(path, prefix)
	path = strings.TrimSuffix(path, "/complete")
	path = strings.TrimSuffix(path, "/")
	id, err := strconv.ParseInt(path, 10, 64)
	if err != nil || id <= 0 {
		return 0, false
	}
	return id, true
}

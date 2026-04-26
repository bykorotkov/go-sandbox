package config

import "os"

type Config struct {
	HTTPAddress string
	DatabaseURL string
}

func FromEnv() Config {
	httpAddress := getEnv("HTTP_ADDRESS", ":8080")
	databaseURL := getEnv("DATABASE_URL", "postgres://postgres:postgres@localhost:5432/todo_db?sslmode=disable")

	return Config{
		HTTPAddress: httpAddress,
		DatabaseURL: databaseURL,
	}
}

func getEnv(key, fallback string) string {
	value := os.Getenv(key)
	if value == "" {
		return fallback
	}

	return value
}

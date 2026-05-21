package config

import (
	"errors"
	"flag"
	"os"
	"strings"

	"github.com/joho/godotenv"
)

type Config struct {
	Server struct {
		Host string
		Port string
		Dev  string
		Web  string
	}
	Database struct {
		Host string
		Port string
		Name string
		User string
		Pass string
	}
	JWT struct {
		Access  string
		Refresh string
	}
}

var (
	config *Config
)

func NewConfig() (*Config, error) {
	if err := LoadConfig(); err != nil {
		return nil, err
	}
	return config, nil
}

func LoadConfig() error {
	if config != nil {
		return nil
	}

	isTest := flag.Lookup("test.v") != nil
	if isTest {
		_ = godotenv.Load("../../.env")
	} else {
		_ = godotenv.Load()
	}

	config = &Config{
		Server: struct {
			Host string
			Port string
			Dev  string
			Web  string
		}{
			Host: os.Getenv("APP_HOST"),
			Port: os.Getenv("APP_PORT"),
			Dev:  os.Getenv("APP_DEV"),
			Web:  os.Getenv("APP_WEB"),
		},
		Database: struct {
			Host string
			Port string
			Name string
			User string
			Pass string
		}{
			Host: os.Getenv("DB_HOST"),
			Port: os.Getenv("DB_PORT"),
			Name: os.Getenv("DB_NAME"),
			User: os.Getenv("DB_USER"),
			Pass: os.Getenv("DB_PASS"),
		},
		JWT: struct {
			Access  string
			Refresh string
		}{
			Access:  os.Getenv("JWT_ACCESS_SECRET"),
			Refresh: os.Getenv("JWT_REFRESH_SECRET"),
		},
	}

	if err := validateConfig(config, isTest); err != nil {
		return err
	}

	return nil
}

func validateConfig(cfg *Config, isTest bool) error {
	if strings.TrimSpace(cfg.Server.Host) == "" || strings.TrimSpace(cfg.Server.Port) == "" {
		return errors.New("APP_HOST and APP_PORT are required")
	}
	if strings.TrimSpace(cfg.Server.Web) == "" {
		return errors.New("APP_WEB is required")
	}
	if !isTest && (len(cfg.JWT.Access) < 32 || len(cfg.JWT.Refresh) < 32) {
		return errors.New("JWT_ACCESS_SECRET and JWT_REFRESH_SECRET must be at least 32 characters")
	}
	if strings.TrimSpace(cfg.Database.Host) == "" || strings.TrimSpace(cfg.Database.Port) == "" || strings.TrimSpace(cfg.Database.Name) == "" || strings.TrimSpace(cfg.Database.User) == "" {
		return errors.New("database configuration is incomplete")
	}
	return nil
}

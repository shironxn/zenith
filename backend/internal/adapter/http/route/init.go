package route

import (
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/limiter"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/shironxn/zenith/internal/config"

	_ "github.com/shironxn/zenith/docs"

	"github.com/gofiber/swagger"
)

type InitRoute struct {
	cfg *config.Config
}

func NewInitRoute(cfg *config.Config) InitRoute {
	return InitRoute{
		cfg: cfg,
	}
}

func (r *InitRoute) Route(app *fiber.App) {
	app.Use(cors.New(
		cors.Config{
			AllowOrigins:     r.cfg.Server.Web,
			AllowMethods:     "GET,POST,PUT,DELETE,OPTIONS",
			AllowHeaders:     "Origin, Content-Type, Accept, Authorization",
			AllowCredentials: true,
			MaxAge:           86400,
		},
	))
	app.Use(logger.New())

	app.Use(limiter.New(limiter.Config{
		Max:        120,
		Expiration: time.Minute,
	}))

	app.Use(func(ctx *fiber.Ctx) error {
		if ctx.Method() == fiber.MethodGet || ctx.Method() == fiber.MethodHead || ctx.Method() == fiber.MethodOptions {
			return ctx.Next()
		}

		origin := strings.TrimSpace(ctx.Get("Origin"))
		if origin == "" {
			return ctx.Next()
		}

		allowedOrigins := strings.Split(r.cfg.Server.Web, ",")
		for _, allowedOrigin := range allowedOrigins {
			if strings.TrimSpace(allowedOrigin) == origin {
				return ctx.Next()
			}
		}

		return fiber.NewError(fiber.StatusForbidden, "origin not allowed")
	})

	if r.cfg.Server.Dev == "true" {
		app.Get("/api/v1/docs/*", swagger.HandlerDefault)
	}
	app.Get("/", func(ctx *fiber.Ctx) error {
		return ctx.Status(fiber.StatusOK).JSON("Welcome to Zenith by shironxn")
	})
}

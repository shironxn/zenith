package config

import (
	"github.com/shironxn/zenith/internal/core/domain"

	"github.com/gofiber/fiber/v2"
)

func NewFiber() *fiber.App {
	return fiber.New(fiber.Config{
		ErrorHandler: ErrorHandler(),
	})
}

func ErrorHandler() fiber.ErrorHandler {
	return func(ctx *fiber.Ctx, err error) error {
		code := fiber.StatusInternalServerError

		if e, ok := err.(*fiber.Error); ok {
			code = e.Code
		}

		message := err.Error()
		if code >= fiber.StatusInternalServerError {
			message = "internal server error"
		}

		return ctx.Status(code).JSON(domain.ErrorResponse{
			Code:  code,
			Error: message,
		})
	}
}

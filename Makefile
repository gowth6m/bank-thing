# -----------------------------------------------------------------------------------------------
# Introspection targets
# -----------------------------------------------------------------------------------------------

.PHONY: help
help: targets

.PHONY: targets
targets:
	@echo "\033[34m---------------------------------------------------------------\033[0m"
	@echo "\033[34mDevelopment Targets\033[0m"
	@echo "\033[34m---------------------------------------------------------------\033[0m"
	@awk '/^[a-zA-Z_-]+:.*## / {printf "\033[33m%-23s\033[0m %s\n", $$1, substr($$0, index($$0, "## ") + 3)}' $(MAKEFILE_LIST)

# -----------------------------------------------------------------------------------------------
# Development targets
# -----------------------------------------------------------------------------------------------

.PHONY: swagger
swagger: ## Generate Swagger documentation && create types for frontend from swagger
	@echo "Generating Swagger documentation..."
	@npm run swagger:generate --prefix ./backend
	@echo "Creating types from swagger"
	@make -C frontend gen-api-types
	@echo "Swagger documentation generated successfully."

.PHONY: docker-prod-up
docker-prod-up: ## Build docker image for production
	@docker-compose -f infra/compose.prod.yml up --build -d

.PHONY: docker-prod-down
docker-prod-down: ## Stop docker containers for production
	@docker-compose -f infra/compose.prod.yml down

.PHONY: docker-local-up
docker-local-up: ## Build docker image for local
	@docker-compose -f infra/compose.local.yml up --build -d

.PHONY: docker-local-down
docker-local-down: ## Stop docker containers for local
	@docker-compose -f infra/compose.local.yml down

.PHONY: create-bankthing-volumes
create-bankthing-volumes: ## Create docker volumes for bankthing
	@docker volume create bankthing-postgres-data
	@docker volume create bankthing-redis-data
	@docker network create web || true

.PHONY: load-test
load-test: ## Run load test
	@k6 run --summary-export=dist/summary.json tests/load-test.js

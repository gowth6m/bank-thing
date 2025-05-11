# -----------------------------------------------------------------------------------------------
# Build configuration
# -----------------------------------------------------------------------------------------------

# Load .env file into environment variables
ifneq (,$(wildcard .env))
    include .env
    export $(shell sed 's/=.*//' .env)
endif

SWAGGER_FILE_PATH ?= ../backend/dist/swagger.json

# -----------------------------------------------------------------------------------------------
# Introspection targets
# -----------------------------------------------------------------------------------------------

.PHONY: help
help: header targets

.PHONY: header
header:
	@echo "\033[34m---------------------------------------------------------------\033[0m"
	@echo "\033[34mEnvironment\033[0m"
	@echo "\033[34m---------------------------------------------------------------\033[0m"
	@echo "\033[33mSWAGGER_FILE_PATH\033[0m: $(SWAGGER_FILE_PATH)"

.PHONY: targets
targets:
	@echo "\033[34m---------------------------------------------------------------\033[0m"
	@echo "\033[34mDevelopment Targets\033[0m"
	@echo "\033[34m---------------------------------------------------------------\033[0m"
	@awk '/^[a-zA-Z_-]+:.*## / {printf "\033[33m%-23s\033[0m %s\n", $$1, substr($$0, index($$0, "## ") + 3)}' $(MAKEFILE_LIST)

# -----------------------------------------------------------------------------------------------
# Development targets
# -----------------------------------------------------------------------------------------------

.PHONY: gen-api-types
run: ## Run the application
	@npm run dev

format: ## Format the code
	@npm run fm:fix

lint: ## Lint the code
	@npm run lint

build: ## Build the application
	@npm run build

gen-api-types: ## Generate API types
	@npx swagger-typescript-api generate -p $(SWAGGER_FILE_PATH) -o ./src/services/types -n index.ts --no-client

# Makefile for managing Docker Compose commands

# Define a variable for the docker-compose command
DOCKER_COMPOSE=docker-compose

# Default target is 'help', which lists all available commands
.DEFAULT_GOAL := help

# Help target to show available commands
help:
	@echo "Available commands:"
	@echo "  build      Start the application with docker-compose up --build"
	@echo "  start      Start the application with docker-compose up"
	@echo "  stop       Stop and remove containers, networks, and volumes"
	@echo "  restart    Stop and start the application (docker-compose stop then up)"
	@echo "  logs       Show logs from running containers"
	@echo "  down       Stop and remove containers, networks, and volumes (no rebuild)"
	@echo "  help       Show this help message"

# Command to run docker-compose up with build
build:
	@echo "Building and starting containers with docker-compose..."
	$(DOCKER_COMPOSE) up --build

# Command to run docker-compose up without build
start:
	@echo "Starting containers with docker-compose..."
	$(DOCKER_COMPOSE) up

# Command to stop and remove the containers, networks, and volumes
stop:
	@echo "Stopping containers..."
	$(DOCKER_COMPOSE) down

# Command to restart the application (stop then start)
restart: stop start
	@echo "Containers have been restarted."

# Command to show logs from the containers
logs:
	@echo "Showing logs from containers..."
	$(DOCKER_COMPOSE) logs -f

# Command to stop the containers without removing them
down:
	@echo "Stopping containers without removing them..."
	$(DOCKER_COMPOSE) down --volumes

export PROJECT_NAME = redis2-lib

export COMPOSE_DOCKER_CLI_BUILD = 1
export DOCKER_BUILDKIT = 1

.PHONY: dependencies-update
dependencies-update:
	docker build --target=dependencies-update --tag=$(PROJECT_NAME) .
	docker run --name=$(PROJECT_NAME) $(PROJECT_NAME)
	docker cp $(PROJECT_NAME):/data/package.json .
	docker rm -vf $(PROJECT_NAME)

.PHONY: clean
clean:
	docker-compose down

.PHONY: test
test:
	docker-compose build --pull
	docker-compose run test

.PHONY: coverage
coverage: test
	@rm -rf coverage
	$(eval ID=$(shell docker ps -a | grep $(PROJECT_NAME)_test_run_ | sed 's/.*$(PROJECT_NAME)_test_run_//' | head -n 1))
	docker cp $(PROJECT_NAME)_test_run_$(ID):/data/coverage ./

.PHONY: publish
publish:
	docker build --build-arg NPM_TOKEN=$(NPM_TOKEN) --tag=$(PROJECT_NAME) --target=publish .
	docker run --name=$(PROJECT_NAME) $(PROJECT_NAME)
	docker cp $(PROJECT_NAME):/data/package.json .
	docker rm -vf $(PROJECT_NAME)
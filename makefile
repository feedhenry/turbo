all: npm_deps

npm_deps:
	npm install .

.PHONY: npm_deps
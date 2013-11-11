all: npm_deps test

test:
	./test/testturbo.js

test-cov:
	./node_modules/.bin/istanbul cover test/testturbo.js
	@echo "See html coverage at: `pwd`/coverage/lcov-report/index.html"

npm_deps:
	npm install .

.PHONY: npm_deps test
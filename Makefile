reporter=dot

serve: node_modules
	@node_modules/serve/bin/serve -Slojp 0

test: node_modules
	@node_modules/mocha/bin/mocha test/*.test.js \
		--reporter $(reporter) \
		--timeout 500 \
		--check-leaks \
		--bail

node_modules: package.json
	@packin install -R \
		--meta package.json \
		--folder node_modules

.PHONY: serve test

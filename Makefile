REPORTER=dot

serve: node_modules/.bin
	@node_modules/.bin/serve

test:
	@node_modules/.bin/mocha test/*.test.js \
		--reporter $(REPORTER) \
		--bail

node_modules: component.json
	@packin install

node_modules/.bin: package.json node_modules
	@npm install
	@npm install http://github.com/jkroso/serve/tarball/1.2.2

clean:
	rm -r node_modules

.PHONY: clean serve test

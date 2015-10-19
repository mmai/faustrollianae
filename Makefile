dev:
	webpack-dev-server -d --progress --colors

clean:
	rm -rf dist/*

build: clean
	webpack -p
	mkdir dist/node_modules
	cp -R node_modules/sw-toolbox dist/node_modules
	cp service-worker.js dist/
	cp index.html dist/
	cp manifest.json dist/
	cp favicon.png dist/
	cp -R img dist/

buildtest: build
	cd dist && python -m SimpleHTTPServer

publish:
	rsync -av dist/ gh-pages/
	cd gh-pages; \
	  git add --ignore-errors *; \
	  git commit -am"update pages";\
	  git push origin gh-pages


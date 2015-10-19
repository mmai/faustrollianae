dev:
	webpack-dev-server -d --progress --colors
clean:
	rm -rf dist/*
build: clean
	webpack -p
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
	  git push


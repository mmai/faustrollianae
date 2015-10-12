dev:
	webpack-dev-server -d --progress --colors
build:
	webpack -p
	cp index.html dist/
buildtest: build
	cd dist && python -m SimpleHTTPServer
publish:
	rsync -av dist/ gh-pages/
	cd gh-pages; \
	  git add --ignore-errors *; \
	  git commit -am"update pages";\
	  git push


dev:
	webpack-dev-server -d --progress --colors
build:
	webpack -p
	cp index.html dist/
buildtest: build
	cd dist && python -m SimpleHTTPServer

.PHONY: setup
setup:
	cargo install wasm-pack
	cd web && yarn

.PHONY: start
start: build_wasm
	cd web && yarn start

.PHONY: build_wasm
build_wasm:
	rm -rf pkg
	wasm-pack build --target web

.PHONY: build
build: build_wasm
	gsed "1c import { cae_print, cae_print_bytecode } from './index.js';" pkg/caescript_web.js > web/src/js/caescript_web.js
	cp pkg/caescript_web_bg.wasm web/src/js/caescript_web_bg.wasm
	cd web && yarn build

# sample-go-neon-functions

A sample that builds a Go HTTP server written with [syumai/workers-go](https://github.com/syumai/workers-go) to WebAssembly and deploys it to [Neon Functions](https://neon.com/docs/compute/functions/overview).

Neon Functions only supports JS/TS, so `src/index.mjs` loads `app.wasm` via `wasm_exec.js` and exposes it as a `fetch` handler.

## Setup

```sh
npm install
```

## Development

```sh
npm run dev
```

## Build and deploy

```sh
npm run build
npm run deploy
```

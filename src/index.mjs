import "./wasm_exec.js";
import { readFile } from "node:fs/promises";

globalThis.tryCatch = (fn) => {
  try {
    return {
      result: fn(),
    };
  } catch (error) {
    return {
      error,
    };
  }
};

let modPromise;

async function fetch(request, env) {
  modPromise ??= readFile(new URL("./app.wasm", import.meta.url)).then(
    WebAssembly.compile,
  );

  const mod = await modPromise;

  const binding = {};
  globalThis.context = { env: env ?? process.env, ctx: {}, binding };

  const go = new globalThis.Go();

  let ready;
  const readyPromise = new Promise((resolve) => {
    ready = resolve;
  });

  const instance = new WebAssembly.Instance(mod, {
    ...go.importObject,
    workers: {
      ready,
    },
  });

  go.run(instance);
  await readyPromise;

  return binding.handleRequest(request);
}

export default {
  fetch,
};

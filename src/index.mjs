import "./wasm_exec.js";
import { readFile } from "node:fs/promises";

let bindingPromise;

async function createBinding() {
  const mod = await WebAssembly.compile(
    await readFile(new URL("./app.wasm", import.meta.url)),
  );

  const binding = {};
  globalThis.context = { env: process.env, ctx: {}, binding };

  const go = new globalThis.Go();

  let ready;
  const readyPromise = new Promise((resolve) => {
    ready = resolve;
  });

  const runPromise = go.run(
    new WebAssembly.Instance(mod, {
      ...go.importObject,
      workers: { ready },
    }),
  );

  runPromise.then(
    () => {
      bindingPromise = undefined;
    },
    (error) => {
      console.error("Go runtime exited unexpectedly:", error);
      bindingPromise = undefined;
    },
  );

  await Promise.race([
    readyPromise,
    runPromise.then(() => {
      throw new Error("Go runtime exited before signaling readiness");
    }),
  ]);

  return binding;
}

export default {
  async fetch(request) {
    bindingPromise ??= createBinding().catch((error) => {
      bindingPromise = undefined;
      throw error;
    });
    return (await bindingPromise).handleRequest(request);
  },
};

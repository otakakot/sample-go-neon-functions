import { defineConfig } from "@neon/config/v1";

export default defineConfig({
  functions: {
    worker: {
      name: "workers-go example",
      source: "./build",
      bundler: "none",
    },
  },
});

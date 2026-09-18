import { defineConfig } from "@neon/config/v1";

export default defineConfig({
  functions: {
    hello: {
      name: "hello",
      source: "./build",
      bundler: "none",
    },
  },
});

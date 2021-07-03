"use strict";

import del from "rollup-plugin-delete";
import typescript from "@rollup/plugin-typescript";

export default {
  input: "src/main.ts",
  external: ["lodash"],
  output: {
    dir: "dist",
    format: "cjs",
    interop: "esModule"
  },
  plugins: [
    del({ targets: "dist/*" }),
    typescript({ tsconfig: "./tsconfig.json" })
  ]
};

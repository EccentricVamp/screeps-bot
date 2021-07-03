"use strict";

import del from "rollup-plugin-delete";
import typescript from "@rollup/plugin-typescript";

export default {
  input: [
    "src/main.ts",
    "src/constants.ts",
    "src/creep.ts",
    "src/filter.ts",
    "src/act/act.ts",
    "src/task/task.ts",
  ],
  external: ["lodash"],
  output: {
    dir: "dist",
    format: "cjs",
    interop: "esModule",
    esModule: false,
    entryFileNames: "[name]"
  },
  plugins: [
    del({ targets: "dist/*" }),
    typescript({ tsconfig: "./tsconfig.json" })
  ]
};

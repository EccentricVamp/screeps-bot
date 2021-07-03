"use strict";

import del from "rollup-plugin-delete";
import typescript from "@rollup/plugin-typescript";

export default {
  input: [
    "src/main.ts",
    "src/Constants.ts",
    "src/Creep.ts",
    "src/Evaluation.ts",
    "src/Filters.ts",
    "src/Maintainer.ts",
    "src/Act/Act.ts",
    "src/Task/Task.ts",
  ],
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

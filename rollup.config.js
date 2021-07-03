"use strict";

import del from "rollup-plugin-delete";
import typescript from "@rollup/plugin-typescript";

export default {
  input: {
    main: "src/main.ts",
    constants: "src/Constants.ts",
    creep: "src/Creep.ts",
    filter: "src/Filter.ts",
    act: "src/Act/Act.ts",
    task: "src/Task/Task.ts",
  },
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

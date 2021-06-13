"use strict";

import del from "rollup-plugin-delete";
import screeps from "rollup-plugin-screeps";
import typescript from "@rollup/plugin-typescript";

export default {
  input: "src/main.ts",
  external: ["lodash"],
  output: {
    file: "dist/main.js",
    format: "cjs",
    interop: "esModule"
  },
  plugins: [
    del({ targets: "dist/*" }),
    screeps({
      configFile: "./screeps.json",
      dryRun: !process.env.publish ?? true
    }),
    typescript({ tsconfig: "./tsconfig.json" })
  ]
}

"use strict";

import del from 'rollup-plugin-delete';
import typescript from '@rollup/plugin-typescript';
import screeps from 'rollup-plugin-screeps';

export default {
  input: "src/main.ts",
  output: {
    file: "dist/main.js",
    format: "cjs",
    interop: "esModule"
  },

  external: ["lodash"],

  plugins: [
    del({ targets: "dist/*" }),
    typescript({ tsconfig: "./tsconfig.json" }),
    screeps({
      configFile: "./screeps.json",
      dryRun: !process.env.publish ?? true
    })
  ]
}

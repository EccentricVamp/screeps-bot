"use strict";

import del from 'rollup-plugin-delete';
import typescript from '@rollup/plugin-typescript';
import screeps from 'rollup-plugin-screeps';

const publish = process.env.publish ?? false;

export default {
  input: "src/main.ts",
  output: {
    file: "dist/main.js",
    format: "cjs"
  },

  external: ["lodash"],

  plugins: [
    del({ targets: "dist/*" }),
    typescript({ tsconfig: "./tsconfig.json" }),
    screeps({ config: "./screeps.json", dryRun: !publish })
  ]
}

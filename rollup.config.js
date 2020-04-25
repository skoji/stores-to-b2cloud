import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

const pkg = require('./package.json');

export default {
  input: 'src/main.js',
  output: {
    file: 'build/index.js',
    format: 'iife'
  },
  plugins: [resolve(), commonjs()]
}

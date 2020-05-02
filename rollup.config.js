import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'src/main.js',
  output: {
    sourcemap: true,
    file: 'build/index.js',
    format: 'iife'
  },
  plugins: [resolve(), commonjs()]
}

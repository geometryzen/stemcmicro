import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
// import { terser } from 'rollup-plugin-terser';
import external from 'rollup-plugin-peer-deps-external';
import dts from 'rollup-plugin-dts';

const packageJson = require('./package.json');

export default [
    {
        input: 'index.ts',
        output: [
            {
                file: packageJson.browser,
                format: 'umd',
                sourcemap: true,
                name: 'SymbolicMath'
            },
            {
                file: packageJson.main,
                format: 'cjs',
                sourcemap: true,
                name: 'SymbolicMath'
            },
            {
                file: packageJson.module,
                format: 'esm',
                sourcemap: true
            }
        ],
        plugins: [
            external(),
            resolve(),
            commonjs(),
            typescript({ tsconfig: './tsconfig.json' }),
            // terser()
        ]
    },
    {
        input: 'dist/esm/types/index.d.ts',
        output: [{ file: packageJson.types, format: "esm" }],
        plugins: [dts()],
    }
]
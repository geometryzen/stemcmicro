import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import { RollupOptions } from 'rollup';
import dts from 'rollup-plugin-dts';
import pkg from './package.json' assert { type: 'json' };

/**
* Comment with library information to be appended in the generated bundles.
*/
const banner = `/**
* ${pkg.name} ${pkg.version}
* (c) ${pkg.author.name} ${pkg.author.email}
* Released under the ${pkg.license} License.
*/
`.trim();

const options: RollupOptions[] = [
    {
        input: './src/index.ts',
        output: [
            {
                banner,
                file: './dist/esm/index.js',
                format: 'esm',
                sourcemap: true
            },
            {
                file: './dist/esm/index.min.js',
                format: 'esm',
                sourcemap: true,
                plugins: [terser()]
            },
            {
                banner,
                file: './dist/system/index.js',
                format: 'system',
                sourcemap: true
            },
            {
                file: './dist/system/index.min.js',
                format: 'system',
                sourcemap: true,
                plugins: [terser()]
            },
            {
                banner,
                file: './dist/commonjs/index.js',
                format: 'commonjs',
                sourcemap: true
            },
        ],
        plugins: [
            // Allows us to consume libraries that are CommonJS.
            commonjs(),
            resolve(),
            typescript({ tsconfig: './tsconfig.json' })
        ]
    },
    // Bundle the generated ESM type definitions.
    {
        input: './dist/esm/types/src/index.d.ts',
        output: [{ file: './dist/index.d.ts', format: "esm" }],
        plugins: [dts()]
    }
];

export default options;
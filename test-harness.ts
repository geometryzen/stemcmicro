/* eslint-disable no-console */
import bigInt from 'big-integer';
import fs from 'fs';
import process from 'process';
import { clear_patterns } from './src/pattern';
import { print_expr } from './src/print';
import { defs } from './src/runtime/defs';
import { define_special_symbols, execute_definitions } from './src/runtime/init';
import { createSymEngine, SymEngine, SymEngineOptions } from './src/runtime/symengine';
import { VERSION_LATEST } from './src/runtime/version';
import { U } from './src/tree/tree';

const shardCount = Number(process.env['TEST_TOTAL_SHARDS']) || 1;
const shardIndex = Number(process.env['TEST_SHARD_INDEX']) || 0;

const testFilter = process.env['TESTBRIDGE_TEST_ONLY'];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
if ((process as any)['TEST_SHARD_STATUS_FILE']) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fs.writeFileSync((process as any)['TEST_SHARD_STATUS_FILE'], '');
}

let passedTests = 0;
let failedTests = 0;
let skippedTests = 0;

process.on('exit', () => {
    // eslint-disable-next-line no-console
    console.log(`${passedTests} passed, ${failedTests} failed, ${skippedTests} skipped.`);
    if (failedTests > 0) {
        process.exit(1);
    }
});

function filter_stack_trace(trace: string) {
    const filtered: string[] = [];
    for (const line of trace.split('\n')) {
        if (line.indexOf('(internal/modules/cjs/loader.js:') > 0) {
            continue;
        }
        filtered.push(line);
    }
    return filtered.join('\n');
}

function safeToString(x: boolean | number | string | string[] | U): string {
    if (typeof x === 'string') {
        return x;
    }
    else if (typeof x === 'boolean') {
        return `${x}`;
    }
    else {
        throw new Error(typeof x);
    }
}

class Asserts {
    is(expect: string | boolean, actual: string | boolean, msg?: string) {
        if (Object.is(expect, actual)) {
            return true;
        }
        // eslint-disable-next-line no-console
        console.log('FAIL');
        // eslint-disable-next-line no-console
        msg && console.log(msg);
        // eslint-disable-next-line no-console
        console.log('Expected: ', safeToString(expect));
        // eslint-disable-next-line no-console
        console.log('Actual:   ', safeToString(actual));
        throw new Error('Failed');
    }
    not(a: number, b: number | bigInt.BigInteger, msg?: string) {
        if (!Object.is(a, b)) {
            return true;
        }
        // eslint-disable-next-line no-console
        console.log('FAIL');
        // eslint-disable-next-line no-console
        msg && console.log(msg);
        // eslint-disable-next-line no-console
        console.log('Should not b: ', a);
        throw new Error('Failed');
    }
}

let testIndex = 0;

function shouldSkip(name: string) {
    if (testIndex++ % shardCount != shardIndex) {
        skippedTests++;
        return true;
    }
    else if (testFilter && name.indexOf(testFilter) != -1) {
        skippedTests++;
        return true;
    }
    return false;
}

let beforeEach = () => {
    // Nothing to see here.
};

function _runTest<T extends unknown[]>(
    name: string,
    f: (t: Asserts, ...args: T) => void,
    ...args: T
) {
    beforeEach();
    // eslint-disable-next-line no-console
    // console.time(name);
    try {
        // eslint-disable-next-line no-console
        // console.lg(name);
        f(new Asserts(), ...args);
    }
    finally {
        // eslint-disable-next-line no-console
        // console.timeEnd(name);
    }
}

function test<T extends unknown[]>(
    name: string,
    f: (t: Asserts, ...args: T) => void,
    ...args: T
) {
    if (shouldSkip(name)) {
        return;
    }
    try {
        _runTest(name, f, ...args);
        passedTests++;
        // eslint-disable-next-line no-console
        // console.lg('OK');
        process.stdout.write('.');
    }
    catch (e) {
        failedTests++;
        if (e instanceof Error) {
            if (e.stack) {
                // eslint-disable-next-line no-console
                console.log(filter_stack_trace(e.stack));
            }
            else {
                // eslint-disable-next-line no-console
                console.log(`${e}`);
            }
        }
    }
}
test.beforeEach = function (hook: () => void) {
    const head = beforeEach;
    beforeEach = () => {
        head();
        hook();
    };
};

test.failing = function failing<T extends unknown[]>(name: string, f: (t: Asserts, ...args: T) => void, ...args: T) {
    if (shouldSkip(name)) {
        return;
    }
    let finished = false;
    try {
        _runTest(name, f, ...args);
        finished = true;
    }
    catch (ex) {
        passedTests++;
        // eslint-disable-next-line no-console
        console.log('Expected failure: ', ex);
    }
    if (finished) {
        // eslint-disable-next-line no-console
        console.log('FAIL: test marked as failing but passed');
        failedTests++;
    }
};

export { test };

function setup_test(f: () => void, engine: SymEngine, options: SymEngineOptions) {
    // TODO: Some global issues to be addressed...
    // Inlining 'clearall' is illuminating.
    // Reveals some objects that are still global.
    // engine.executeScript('clearall');
    clear_patterns();

    // We need to redo these...
    const $ = engine.$;
    $.clearBindings();
    // Don't redo the keywords or NIL.
    define_special_symbols($);
    execute_definitions(options, $);

    // TODO: Remove these comments when everything is working.
    // Not going to do this anymore.
    // It represents hidden knowledge that we don't want to keep track of.
    // It may affect some tests scripts that will require updating.
    // Keeping it here as a note for now.

    // engine.executeScript('e=quote(e)');

    const orig_test_flag = defs.testFlag;
    defs.setTestFlag(true);
    try {
        f();
    }
    finally {
        defs.setTestFlag(orig_test_flag);
    }
}

/**
 * Use this when order of execution doesn't matter.
 * (e.g. s doesn't set any variables)
 * @param s 
 * @param prefix 
 */
export function run_shardable_test(s: string[], prefix = '') {
    const options: SymEngineOptions = { version: 1 };
    const engine = createSymEngine(options);
    try {
        setup_test(() => {
            for (let i = 0; i < s.length; i += 2) {
                test((prefix || `${testIndex}: `) + s[i], t => {
                    defs.out_count = 0;
                    const $ = engine.$;
                    t.is(s[i + 1], print_expr(engine.executeScript(s[i]).values[0], $));
                });
            }
        }, engine, options);
    }
    finally {
        engine.release();
    }
}

export interface TestOptions {
    treatAsVectors?: string[];
    useCaretForExponentiation?: boolean;
    useDefinitions?: boolean;
    verbose?: boolean;
    version?: 1 | 2 | 3;
    name?: string;
}

interface TestConfig {
    treatAsVectors: string[];
    useCaretForExponentiation: boolean;
    useDefinitions: boolean;
    verbose: boolean;
    version: 1 | 2 | 3;
}

function useCaretForExponentiation(version: 1 | 2 | 3 | undefined): boolean {
    if (typeof version === 'number') {
        switch (version) {
            case 1: {
                return true;
            }
            default: {
                return false;
            }
        }
    }
    else {
        return false;
    }
}

function useDefinitions(version: 1 | 2 | 3 | undefined): boolean {
    if (typeof version === 'number') {
        switch (version) {
            case 1: {
                return true;
            }
            default: {
                return false;
            }
        }
    }
    else {
        return false;
    }
}

function test_config_from_options(options: TestOptions | undefined): TestConfig {
    if (options) {
        const config: TestConfig = {
            treatAsVectors: Array.isArray(options.treatAsVectors) ? options.treatAsVectors : [],
            useCaretForExponentiation: typeof options.useCaretForExponentiation === 'boolean' ? options.useCaretForExponentiation : useCaretForExponentiation(options.version),
            useDefinitions: typeof options.useDefinitions === 'boolean' ? options.useDefinitions : useDefinitions(options.version),
            verbose: typeof options.verbose === 'boolean' ? options.verbose : false,
            version: typeof options.version === 'number' ? options.version : VERSION_LATEST
        };
        return config;
    }
    else {
        const config: TestConfig = {
            treatAsVectors: [],
            useCaretForExponentiation: useCaretForExponentiation(VERSION_LATEST),
            useDefinitions: useDefinitions(VERSION_LATEST),
            verbose: false,
            version: VERSION_LATEST
        };
        return config;
    }
}

function harness_options_to_engine_options(options: TestOptions | undefined): SymEngineOptions {
    if (options) {
        return {
            treatAsVectors: Array.isArray(options.treatAsVectors) ? options.treatAsVectors : [],
            useCaretForExponentiation: typeof options.useCaretForExponentiation === 'boolean' ? options.useCaretForExponentiation : useCaretForExponentiation(VERSION_LATEST),
            useDefinitions: typeof options.useDefinitions === 'boolean' ? options.useDefinitions : useDefinitions(VERSION_LATEST),
            version: typeof options.version === 'number' ? options.version : VERSION_LATEST
        };
    }
    else {
        return {
            treatAsVectors: [],
            useCaretForExponentiation: useCaretForExponentiation(VERSION_LATEST),
            useDefinitions: useDefinitions(VERSION_LATEST),
            version: VERSION_LATEST
        };
    }
}

function name_from_harness_options(options: TestOptions | undefined): string | undefined {
    if (options) {
        return options.name;
    }
    else {
        return void 0;
    }
}

/**
 * Using the new run_test function will give you better control of the execution environment
 * by being able to configure the symbolic math engine.
 * 
 * 1. const engine = createSymEngine({version: 2});
 * 2. run_test([...], engine);
 * 3. engine.release(); 
 */
export function run_test(s: string[], options?: TestOptions): void {
    const config = test_config_from_options(options);
    const engcfg = harness_options_to_engine_options(options);
    const engine = createSymEngine(engcfg);
    try {
        setup_test(() => {
            test(name_from_harness_options(options) || `${testIndex}`, t => {
                for (let i = 0; i < s.length; i += 2) {
                    defs.out_count = 0;
                    const sourceText = s[i];
                    if (config.verbose) {
                        console.log('=========================================');
                        console.log(`Executing Script: ${JSON.stringify(sourceText)}`);
                    }
                    try {
                        const A = engine.executeScript(sourceText);
                        // console.lg(`values => ${A.values}`);
                        // console.lg(`errors => ${A.errors}`);
                        // console.lg(`prints => ${JSON.stringify(A.prints)}`);
                        if (A.errors.length > 0) {
                            const B = A.errors[0];
                            const C = B.message;
                            t.is(s[i + 1], C, `${i}: ${sourceText}`);
                        }
                        else {
                            if (A.prints.length > 0) {
                                const B = A.prints[0];
                                t.is(s[i + 1], B, `${i}: ${sourceText}`);
                            }
                            else {
                                if (A.values.length > 0) {
                                    const B = A.values[0];
                                    const $ = engine.$;
                                    const C = print_expr(B, $);
                                    t.is(s[i + 1], C, `${i}: ${sourceText}`);
                                }
                            }
                        }
                    }
                    catch (e) {
                        if (e instanceof Error) {
                            console.log(sourceText);
                            console.log(e.stack);
                        }
                    }
                }
            });
        }, engine, engcfg);
    }
    finally {
        engine.release();
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function xrun_test(s: string[], options?: TestOptions): void {
    skippedTests++;
}

/*
export function run_test(s: string[], engine: SymEngine, name?: string) {
  setup_test(() => {
    test(name || `${testIndex}`, t => {
      for (let i = 0; i < s.length; i += 2) {
        defs.out_count = 0;

        t.is(s[i + 1], engine.run(s[i]), `${i}: ${s[i]}`);
      }
    });
  }, engine);
}
*/

/**
 * This appears to be dead code.
 */
export function ava_run(t: Asserts, input: string, expected: string) {
    const engcfg: SymEngineOptions = { version: 1 };
    const engine = createSymEngine(engcfg);
    try {
        const $ = engine.$;
        setup_test(() => t.is(expected, print_expr(engine.executeScript(input).values[0], $)), engine, engcfg);
    }
    finally {
        engine.release();
    }
}

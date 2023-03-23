/* eslint-disable no-console */
import bigInt from 'big-integer';
import fs from 'fs';
import process from 'process';
import { SymbolProps } from './src/env/ExtensionEnv';
import { SyntaxKind } from './src/parser/parser';
import { clear_patterns } from './src/pattern';
import { defs } from './src/runtime/defs';
import { create_script_context, ScriptContext, ScriptContextOptions } from './src/runtime/script_engine';
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

/*
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
*/

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
        console.log('Expect:   ', safeToString(expect));
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
        // console.log("name:", name);
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
        // console.log('OK');
        process.stdout.write('.');
    }
    catch (e) {
        failedTests++;
        if (e instanceof Error) {
            if (e.stack) {
                // eslint-disable-next-line no-console
                // console.log(filter_stack_trace(e.stack));
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
        console.log();
        console.log('FAIL: test marked as failing but passed');
        failedTests++;
    }
};

export { test };

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function setup_test(f: () => void, engine: ScriptContext, options: ScriptContextOptions) {
    // TODO: Some global issues to be addressed...
    // Inlining 'clearall' is illuminating.
    // Reveals some objects that are still global.
    // engine.executeScript('clearall');
    clear_patterns();

    // We need to redo these...
    engine.clearBindings();

    // TODO: Do away with the coarse useStandardDefinitions...
    if (options.useDefinitions) {
        engine.executeScript("e=exp(1)");
        engine.executeScript("i=sqrt(-1)");
        engine.executeScript("pi=tau(1)/2");
        engine.useStandardDefinitions();
    }

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
    const options: ScriptContextOptions = {};
    const engine = create_script_context(options);
    try {
        setup_test(() => {
            for (let i = 0; i < s.length; i += 2) {
                test((prefix || `${testIndex}: `) + s[i], t => {
                    t.is(s[i + 1], engine.renderAsInfix(engine.executeScript(s[i]).values[0]));
                });
            }
        }, engine, options);
    }
    finally {
        engine.release();
    }
}

type DEPENDENCY = 'Flt' | 'Imu';

export interface TestOptions {
    assumes?: { [name: string]: Partial<SymbolProps> };
    dependencies?: DEPENDENCY[];
    useCaretForExponentiation?: boolean;
    useDefinitions?: boolean;
    useIntegersForPredicates?: boolean;
    verbose?: boolean;
    name?: string;
}

interface TestConfig {
    assumes: { [name: string]: Partial<SymbolProps> };
    dependencies: DEPENDENCY[];
    useCaretForExponentiation: boolean;
    useDefinitions: boolean;
    useIntegersForPredicates: boolean;
    verbose: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function test_config_from_options(options: TestOptions | undefined): TestConfig {
    if (options) {
        const config: TestConfig = {
            assumes: options.assumes ? options.assumes : {},
            dependencies: Array.isArray(options.dependencies) ? options.dependencies : [],
            useCaretForExponentiation: typeof options.useCaretForExponentiation === 'boolean' ? options.useCaretForExponentiation : true,
            useDefinitions: typeof options.useDefinitions === 'boolean' ? options.useDefinitions : true,
            useIntegersForPredicates: typeof options.useIntegersForPredicates === 'boolean' ? options.useIntegersForPredicates : true,
            verbose: typeof options.verbose === 'boolean' ? options.verbose : false
        };
        return config;
    }
    else {
        const config: TestConfig = {
            assumes: {},
            dependencies: [],
            useCaretForExponentiation: true,
            useDefinitions: true,
            useIntegersForPredicates: true,
            verbose: false
        };
        return config;
    }
}

/**
 * For the test harness we use the caret symbol for exponentiation.
 */
function harness_options_to_script_context_options(options: TestOptions | undefined): ScriptContextOptions {
    if (options) {
        return {
            assumes: options.assumes,
            useCaretForExponentiation: typeof options.useCaretForExponentiation === 'boolean' ? options.useCaretForExponentiation : true,
            useDefinitions: typeof options.useDefinitions === 'boolean' ? options.useDefinitions : true,
            useIntegersForPredicates: typeof options.useIntegersForPredicates === 'boolean' ? options.useIntegersForPredicates : true,
            syntaxKind: SyntaxKind.Native
        };
    }
    else {
        return {
            useCaretForExponentiation: true,
            useDefinitions: true,
            useIntegersForPredicates: true,
            syntaxKind: SyntaxKind.Native
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
    // const config = test_config_from_options(options);
    const engcfg: ScriptContextOptions = harness_options_to_script_context_options(options);
    // Unfortunately, setup_test clears bindings and patterns that were established in the script context.
    const engine = create_script_context(engcfg);
    try {
        setup_test(() => {
            test(name_from_harness_options(options) || `${testIndex}`, t => {
                for (let i = 0; i < s.length; i += 2) {
                    const sourceText = s[i];
                    // eslint-disable-next-line no-constant-condition
                    if (true/*config.verbose*/) {
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
                                    const C = engine.renderAsInfix(B);
                                    t.is(s[i + 1], C, `${i}: ${sourceText}`);
                                }
                            }
                        }
                    }
                    catch (e) {
                        if (e instanceof Error) {
                            console.log('Source:   ', sourceText);
                            // console.log(e.stack);
                            throw e;
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

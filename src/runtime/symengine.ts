import { createEnv, EnvOptions } from "../env/env";
import { ExtensionEnv } from "../env/ExtensionEnv";
import { register_known_operators } from "../env/register_known_operators";
import { create_source_trees } from "../scanner/create_source_tree";
import { ScanOptions } from "../scanner/scan";
import { Sym } from "../tree/sym/Sym";
import { U } from "../tree/tree";
import { defs, hard_reset, set_behaviors_to_version } from "./defs";
import { execute_script, transform_tree } from "./execute";
import { define_std_symbols, execute_definitions } from "./init";
import { run } from "./run";
import { VERSION_LATEST } from "./version";

export interface Assoc {
    sym: Sym;
    dir: 'L' | 'R'
}

export interface SymEngineOptions {
    assocs?: Assoc[];
    treatAsVectors?: string[];
    useCaretForExponentiation?: boolean;
    useDefinitions?: boolean;
    version?: 1 | 2 | 3;
}

function version_from_options(options: SymEngineOptions | undefined): 1 | 2 | 3 {
    if (typeof options === 'undefined') {
        return 2;
    }
    else {
        if (typeof options.version === 'undefined') {
            return 2;
        }
        if (typeof options.version === 'number') {
            return options.version;
        }
        throw new Error("options.version MUST be a number");
    }
}

function init($: ExtensionEnv, options?: SymEngineOptions) {

    const version = version_from_options(options);

    hard_reset();

    defs.chainOfUserSymbolsNotFunctionsBeingEvaluated = [];

    $.resetSymTab();

    // TODO: We would like to get away from these global defs and instead use the environment.
    set_behaviors_to_version(version);

    define_std_symbols($);

    $.reset();

    register_known_operators(version, options, $);

    $.initialize();

    execute_definitions(options, $);
}

function term($: ExtensionEnv) {
    $.reset();

    $.resetSymTab();
}

export interface SymEngine {
    /**
     * Provides access to the extension environment.
     * The returned environment is reference counted; the return value should be released when no longer needed.
     */
    readonly $: ExtensionEnv;
    /**
     * Parse the sourceText to create an array of trees that may be transformed.
     * @param sourceText 
     * @param options 
     */
    scanSourceText(sourceText: string, options?: ScanOptions): { trees: U[], errors: Error[] };
    transformTree(tree: U): { value: U, prints: string[], errors: Error[] };
    executeScript(sourceText: string): { values: U[], prints: string[], errors: Error[] };
    /**
     * Provided to assist in migration from 1.x to 2.x
     * This will be deprecated in future. Please use exceuteScript.
     * @param sourceText The source text.
     * @param generateLaTeX Determines whether LaTeX will be generated.
     */
    run(sourceText: string, generateLaTeX?: boolean): string | string[];
    addRef(): void;
    release(): void;
}

function env_options_from_engine_options(options: SymEngineOptions | undefined): EnvOptions {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const hook = function (retval: EnvOptions, description: string): EnvOptions {
        // console.lg(`env_options_from_engine_options(${JSON.stringify(options)}) => ${JSON.stringify(retval)} @ ${description}`);
        return retval;
    };
    if (options) {
        const config: EnvOptions = {
            assocs: Array.isArray(options.assocs) ? options.assocs : [],
            treatAsVectors: Array.isArray(options.treatAsVectors) ? options.treatAsVectors : [],
            useCaretForExponentiation: options.useCaretForExponentiation,
            useDefinitions: options.useDefinitions,
            version: options.version
        };
        return hook(config, "A");
    }
    else {
        const config: EnvOptions = {
            assocs: [],
            treatAsVectors: [],
            useCaretForExponentiation: false,
            useDefinitions: false,
            version: VERSION_LATEST
        };
        return hook(config, "B");
    }
}

/**
 * Creates an engine for executing scripts.
 * The returned engine is reference counted and should be released when no longer needed.
 */
export function createSymEngine(options?: SymEngineOptions): SymEngine {
    let ref_count = 1;
    // TODO: At some point we stop using the global ExtensionEnv and create our own...
    const envOptions: EnvOptions = env_options_from_engine_options(options);
    const $ = createEnv(envOptions);
    init($, options);
    const theEngine: SymEngine = {
        get $(): ExtensionEnv {
            return $;
        },
        scanSourceText(sourceText: string, options?: ScanOptions): { trees: U[], errors: Error[] } {
            return create_source_trees(sourceText, options);
        },
        transformTree(tree: U): { value: U, prints: string[], errors: Error[] } {
            return transform_tree(tree, $);
        },
        executeScript(sourceText: string): { values: U[], prints: string[], errors: Error[] } {
            return execute_script(sourceText, $);
        },
        run(sourceText: string, generateLaTeX?: boolean): string | string[] {
            return run(sourceText, $, generateLaTeX);
        },
        addRef(): void {
            ref_count++;
        },
        release(): void {
            ref_count--;
            if (ref_count === 0) {
                term($);
            }
        }
    };
    return theEngine;
}
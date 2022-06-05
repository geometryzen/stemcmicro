import { define_std_operators } from "../env/define_std_operators";
import { create_env, EnvOptions } from "../env/env";
import { ExtensionEnv } from "../env/ExtensionEnv";
import { Sym } from "../tree/sym/Sym";
import { U } from "../tree/tree";
import { hard_reset } from "./defs";
import { execute_script, transform_tree } from "./execute";
import { execute_std_definitions } from "./init";

export interface Assoc {
    sym: Sym;
    dir: 'L' | 'R'
}

export type DEPENDENCY = 'Blade' | 'Flt' | 'Imu' | 'Uom' | 'Vector';

export interface EngineOptions {
    assocs?: Assoc[];
    dependencies?: DEPENDENCY[];
    treatAsVectors?: string[];
    useCaretForExponentiation?: boolean;
    useDefinitions?: boolean;
}

export function init_env($: ExtensionEnv, options?: EngineOptions) {

    hard_reset();

    $.resetSymTab();

    $.clearOperators();

    define_std_operators($);

    $.buildOperators();

    if (options && options.useDefinitions) {
        execute_std_definitions($);
    }
}

export function env_term($: ExtensionEnv) {
    $.clearOperators();

    $.resetSymTab();
}

export interface Engine {
    /**
     * Provides access to the extension environment.
     * The returned environment is reference counted; the return value should be released when no longer needed.
     */
    readonly $: ExtensionEnv;
    transformTree(tree: U): { value: U, prints: string[], errors: Error[] };
    executeScript(sourceText: string): { values: U[], prints: string[], errors: Error[] };
    addRef(): void;
    release(): void;
}

function env_options_from_engine_options(options: EngineOptions | undefined): EnvOptions {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const hook = function (retval: EnvOptions, description: string): EnvOptions {
        // console.lg(`env_options_from_engine_options(${JSON.stringify(options)}) => ${JSON.stringify(retval)} @ ${description}`);
        return retval;
    };
    if (options) {
        const config: EnvOptions = {
            assocs: Array.isArray(options.assocs) ? options.assocs : [],
            includes: Array.isArray(options.dependencies) ? options.dependencies : [],
            treatAsVectors: Array.isArray(options.treatAsVectors) ? options.treatAsVectors : [],
            useCaretForExponentiation: options.useCaretForExponentiation,
            useDefinitions: options.useDefinitions
        };
        return hook(config, "A");
    }
    else {
        const config: EnvOptions = {
            assocs: [],
            includes: [],
            treatAsVectors: [],
            useCaretForExponentiation: false,
            useDefinitions: false
        };
        return hook(config, "B");
    }
}

/**
 * Creates an engine for executing scripts.
 * The returned engine is reference counted and should be released when no longer needed.
 */
export function create_engine(options?: EngineOptions): Engine {
    let ref_count = 1;
    const envOptions: EnvOptions = env_options_from_engine_options(options);
    const $ = create_env(envOptions);
    init_env($, options);
    const theEngine: Engine = {
        get $(): ExtensionEnv {
            return $;
        },
        transformTree(tree: U): { value: U, prints: string[], errors: Error[] } {
            return transform_tree(tree, $);
        },
        executeScript(sourceText: string): { values: U[], prints: string[], errors: Error[] } {
            return execute_script(sourceText, $);
        },
        addRef(): void {
            ref_count++;
        },
        release(): void {
            ref_count--;
            if (ref_count === 0) {
                env_term($);
            }
        }
    };
    return theEngine;
}
import { define_std_operators } from "../env/define_std_operators";
import { create_env, EnvOptions } from "../env/env";
import { ExtensionEnv } from "../env/ExtensionEnv";
import { render_as_infix } from "../print/print";
import { render_as_latex } from "../print/render_as_latex";
import { render_as_sexpr } from "../print/render_as_sexpr";
import { U } from "../tree/tree";
import { hard_reset } from "./defs";
import { execute_script, transform_tree } from "./execute";
import { execute_std_definitions } from "./init";

export interface ScriptEngineOptions {
    /**
     * Determines whether the circumflex (caret) character, '^', will be used during parsing to denote exponentiation.
     * The alternative is to use '**', freeing the caret character for use with outer products which is convenient
     * in applications using Geometric Algebra. The default value is false.
     */
    useCaretForExponentiation?: boolean;
    useDefinitions?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function init_env($: ExtensionEnv, options?: ScriptEngineOptions) {

    hard_reset();

    $.clearBindings();
    $.clearOperators();

    define_std_operators($);

    $.buildOperators();

    if (options && options.useDefinitions) {
        execute_std_definitions($);
    }
}

export function env_term($: ExtensionEnv) {
    $.clearBindings();
    $.clearOperators();
}

export interface ScriptEngine {
    clearBindings(): void;
    evaluate(tree: U): { value: U, prints: string[], errors: Error[] };
    useStandardDefinitions(): void;
    executeScript(sourceText: string): { values: U[], prints: string[], errors: Error[] };
    renderAsInfix(expr: U): string;
    renderAsLaTeX(expr: U): string;
    renderAsSExpr(expr: U): string;
    addRef(): void;
    release(): void;
}

export function env_options_from_engine_options(options: ScriptEngineOptions | undefined): EnvOptions {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const hook = function (retval: EnvOptions, description: string): EnvOptions {
        // console.lg(`env_options_from_engine_options(${JSON.stringify(options)}) => ${JSON.stringify(retval)} @ ${description}`);
        return retval;
    };
    if (options) {
        const config: EnvOptions = {
            assocs: [],
            dependencies: ['Blade', 'Flt', 'Imu', 'Uom', 'Vector'],
            disable: [],
            noOptimize: false,
            useCaretForExponentiation: options.useCaretForExponentiation,
            useDefinitions: options.useDefinitions
        };
        return hook(config, "A");
    }
    else {
        const config: EnvOptions = {
            assocs: [],
            dependencies: ['Blade', 'Flt', 'Imu', 'Uom', 'Vector'],
            disable: [],
            noOptimize: false,
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
export function create_script_engine(options?: ScriptEngineOptions): ScriptEngine {
    let ref_count = 1;
    const envOptions: EnvOptions = env_options_from_engine_options(options);
    const $ = create_env(envOptions);
    init_env($, options);
    const theEngine: ScriptEngine = {
        clearBindings(): void {
            $.clearBindings();
        },
        evaluate(tree: U): { value: U, prints: string[], errors: Error[] } {
            // This is like a fixed pipeline.
            return transform_tree(tree, $);
        },
        useStandardDefinitions(): void {
            execute_std_definitions($);
        },
        executeScript(sourceText: string): { values: U[], prints: string[], errors: Error[] } {
            return execute_script(sourceText, $);
        },
        renderAsInfix(expr: U): string {
            return render_as_infix(expr, $);
        },
        renderAsLaTeX(expr: U): string {
            return render_as_latex(expr, $);
        },
        renderAsSExpr(expr: U): string {
            return render_as_sexpr(expr, $);
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

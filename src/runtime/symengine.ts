import { define_std_operators } from "../env/define_std_operators";
import { create_env, EnvOptions } from "../env/env";
import { ExtensionEnv } from "../env/ExtensionEnv";
import { render_as_infix } from "../print/print";
import { render_as_latex } from "../print/render_as_latex";
import { render_as_sexpr } from "../print/render_as_sexpr";
import { Sym } from "../tree/sym/Sym";
import { U } from "../tree/tree";
import { hard_reset } from "./defs";
import { execute_script, transform, transform_tree } from "./execute";
import { execute_std_definitions } from "./init";

export interface EngineOptions {
    /**
     * Determines the direction of association for associative operators.
     * The default is left-association with the exception of exponentiation which associates to the right.
     */
    assocs?: { sym: Sym; dir: 'L' | 'R' }[];
    /**
     * Determines the features that the script depends on. The default value is to include all features.
     * Restricting the features may be done for optimization or functional reasons.
     */
    dependencies?: ('Blade' | 'Flt' | 'Imu' | 'Uom' | 'Vector')[];
    /**
     * Determines which symbols should be treated as vectors as opposed to real numbers.
     */
    treatAsVectors?: string[];
    /**
     * Determines whether the circumflex (caret) character, '^', will be used during parsing to denote exponentiation.
     * The alternative is to use '**', freeing the caret character for use with outer products which is convenient
     * in applications using Geometric Algebra. The default value is false.
     */
    useCaretForExponentiation?: boolean;
    /**
     *
     */
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
    transform(expr: U): U;
    executeScript(sourceText: string): { values: U[], prints: string[], errors: Error[] };
    renderAsInfix(expr: U): string;
    renderAsLaTeX(expr: U): string;
    renderAsSExpr(expr: U): string;
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
            dependencies: Array.isArray(options.dependencies) ? options.dependencies : ['Blade', 'Flt', 'Imu', 'Uom', 'Vector'],
            treatAsVectors: Array.isArray(options.treatAsVectors) ? options.treatAsVectors : [],
            useCaretForExponentiation: options.useCaretForExponentiation,
            useDefinitions: options.useDefinitions
        };
        return hook(config, "A");
    }
    else {
        const config: EnvOptions = {
            assocs: [],
            dependencies: [],
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
        transform(expr: U): U {
            return transform(expr, $);
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
import { assert_sym, create_sym, Sym } from "math-expression-atoms";
import { LambdaExpr } from "math-expression-context";
import { Cons, U } from "math-expression-tree";
import { define_geometric30_algebra, define_math_constant_pi, define_metric_prefixes_for_si_units, define_si_units, define_spacetime_algebra, UndeclaredVars } from "../api/api";
import { define_std_operators } from "../env/define_std_operators";
import { create_env, EnvOptions } from "../env/env";
import { ALL_FEATURES, Directive, ExtensionEnv, flag_from_directive, Predicates } from "../env/ExtensionEnv";
import { simplify } from "../operators/simplify/simplify";
import { ParseOptions, SyntaxKind } from "../parser/parser";
import { render_as_ascii } from "../print/render_as_ascii";
import { render_as_human } from "../print/render_as_human";
import { render_as_infix } from "../print/render_as_infix";
import { render_as_latex } from "../print/render_as_latex";
import { render_as_sexpr } from "../print/render_as_sexpr";
import { move_top_of_stack } from "./defs";
import { execute_script, transform_tree } from "./execute";
import { execute_definitions } from "./init";

export interface ExprTransformOptions {
    autoExpand?: boolean;
    autoFactor?: boolean;
    /**
     * Directives that become enabled by setting to true.
     */
    enable?: Directive[];
    /**
     * Directives that become disabled by setting to false.
     */
    disable?: Directive[];
    useIntegersForPredicates?: boolean;
}

export interface ScriptExecuteOptions extends ExprTransformOptions {
    /**
     * Determines whether execptions are caught and returned in the errors property.
     */
    catchExceptions?: boolean;
    /**
     * Determines what kind of parser is used for the sourceText.
     */
    syntaxKind?: SyntaxKind;
}

export interface ScriptContextOptions extends ScriptExecuteOptions {
    /**
     * The default is ???.
     */
    allowUndeclaredVars?: UndeclaredVars;
    /**
     * The assumptions about unbound symbols.
     */
    assumes?: { [name: string]: Partial<Predicates> };
    dependencies?: string[];
    /**
     * Determines whether the circumflex (caret) character, '^', will be used during parsing to denote exponentiation.
     * The alternative is to use '**', freeing the caret character for use with outer products which is convenient
     * in applications using Geometric Algebra. The default value is false.
     */
    useCaretForExponentiation?: boolean;
    useDerivativeShorthandLowerD?: boolean;
    /**
     *
     */
    prolog?: string[];
    /**
     * Determines whether test functions will return boolean or integer values.
     *
     * The default is false.
     */
    useIntegersForPredicates?: boolean;
    /**
     * Determines whether parentheses, "(" and ")", or square brackets, "[" and "]", will be used to delimit tensors.
     */
    useParenForTensors?: boolean;
}

export function init_env($: ExtensionEnv, options: ScriptContextOptions = { useDerivativeShorthandLowerD: false }) {
    move_top_of_stack(0);

    $.clearBindings();
    $.clearOperators();

    if (options && options.assumes) {
        const names = Object.keys(options.assumes);
        for (const name of names) {
            const props = options.assumes[name];
            $.setSymbolPredicates(create_sym(name), props);
        }
    }

    define_std_operators($, {
        useDerivativeShorthandLowerD: !!options.useDerivativeShorthandLowerD
    });

    $.buildOperators();

    if (options && options.prolog) {
        if (Array.isArray(options.prolog)) {
            execute_definitions(options.prolog, $);
        } else {
            throw new Error("prolog must be a string[]");
        }
    }
}

export function env_term($: ExtensionEnv) {
    $.clearBindings();
    $.clearOperators();
}

export interface ScriptContext {
    readonly $: ExtensionEnv;
    clearBindings(): void;
    defineFunction(pattern: U, impl: LambdaExpr): void;
    getSymbolProps(sym: Sym): Predicates;
    getBinding(opr: Sym, target: Cons): U;
    getSymbolsInfo(): { sym: Sym; value: U }[];
    evaluate(tree: U, options?: ExprTransformOptions): { value: U; prints: string[]; errors: Error[] };
    executeProlog(prolog: string[]): void;
    executeScript(sourceText: string, options?: ScriptExecuteOptions): { values: U[]; prints: string[]; errors: Error[] };
    renderAsAscii(expr: U): string;
    renderAsHuman(expr: U): string;
    renderAsInfix(expr: U): string;
    renderAsLaTeX(expr: U): string;
    renderAsSExpr(expr: U): string;
    simplify(expr: U): U;
    addRef(): void;
    release(): void;
}

export function env_options_from_script_context_options(options: ScriptContextOptions | undefined): EnvOptions {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const hook = function (retval: EnvOptions, description: string): EnvOptions {
        // console.lg(`env_options_from_engine_options(${JSON.stringify(options)}) => ${JSON.stringify(retval)} @ ${description}`);
        return retval;
    };
    if (options) {
        const config: EnvOptions = {
            allowUndeclaredVars: typeof options.allowUndeclaredVars === "number" ? options.allowUndeclaredVars : UndeclaredVars.Nil,
            assumes: options.assumes,
            dependencies: ALL_FEATURES,
            enable: options.enable,
            disable: options.disable,
            noOptimize: false,
            useCaretForExponentiation: options.useCaretForExponentiation,
            useDerivativeShorthandLowerD: options.useDerivativeShorthandLowerD,
            useIntegersForPredicates: options.useIntegersForPredicates,
            useParenForTensors: options.useParenForTensors,
            syntaxKind: options.syntaxKind
        };
        return hook(config, "A");
    } else {
        const config: EnvOptions = {
            allowUndeclaredVars: UndeclaredVars.Nil,
            assumes: {},
            dependencies: ALL_FEATURES,
            enable: [],
            disable: [],
            noOptimize: false,
            useCaretForExponentiation: false,
            useDerivativeShorthandLowerD: false,
            useIntegersForPredicates: false,
            useParenForTensors: false
        };
        return hook(config, "B");
    }
}

/**
 * TODO: The REP should migrate toward the ExprEngine API.
 * @deprecated Used only by development REPL.
 */
export function create_script_context(contextOptions: ScriptContextOptions = {}): ScriptContext {
    // console.lg("create_script_context");
    let ref_count = 1;
    const envOptions: EnvOptions = env_options_from_script_context_options(contextOptions);
    const $ = create_env(envOptions);
    init_env($, contextOptions);
    switch (contextOptions.syntaxKind) {
        case SyntaxKind.ClojureScript:
        case SyntaxKind.Eigenmath:
        case SyntaxKind.PythonScript: {
            break;
        }
        default: {
            define_math_constant_pi($);
            define_spacetime_algebra($);
            define_geometric30_algebra($);
            define_si_units($);
            define_metric_prefixes_for_si_units($);
            break;
        }
    }
    const theEngine: ScriptContext = {
        get $(): ExtensionEnv {
            return $;
        },
        clearBindings(): void {
            $.clearBindings();
        },
        defineFunction(pattern: U, impl: LambdaExpr): void {
            $.defineFunction(pattern, impl);
        },
        getSymbolProps(sym: Sym): Predicates {
            return $.getSymbolPredicates(sym);
        },
        getBinding(opr: Sym, target: Cons): U {
            assert_sym(opr);
            return $.getBinding(opr, target);
        },
        getSymbolsInfo(): { sym: Sym; value: U }[] {
            return $.getSymbolsInfo();
        },
        evaluate(tree: U, options?: ExprTransformOptions): { value: U; prints: string[]; errors: Error[] } {
            const merged = merge_options(options, contextOptions);
            return transform_tree(tree, merged, $);
        },
        executeProlog(prolog: string[]): void {
            execute_definitions(prolog, $);
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        executeScript(sourceText: string, options: ScriptExecuteOptions): { values: U[]; prints: string[]; errors: Error[] } {
            // console.lg("executeScript", sourceText);
            const picks: Pick<ScriptContextOptions, "catchExceptions" | "syntaxKind" | "useIntegersForPredicates"> = {};
            if (contextOptions) {
                if (typeof contextOptions.catchExceptions === "boolean") {
                    picks.catchExceptions = contextOptions.catchExceptions;
                }
                if (contextOptions.syntaxKind) {
                    picks.syntaxKind = contextOptions.syntaxKind;
                }
                if (typeof contextOptions.useIntegersForPredicates === "boolean") {
                    picks.useIntegersForPredicates = contextOptions.useIntegersForPredicates;
                }
                contextOptions.disable;
            }
            if (options) {
                if (typeof options.catchExceptions === "boolean") {
                    picks.catchExceptions = options.catchExceptions;
                }
                if (options.syntaxKind) {
                    picks.syntaxKind = options.syntaxKind;
                }
                if (typeof options.useIntegersForPredicates === "boolean") {
                    picks.useIntegersForPredicates = options.useIntegersForPredicates;
                }
            }
            return execute_script(sourceText, parse_options_from_script_context_options(picks, $), $);
        },
        renderAsAscii(expr: U): string {
            return render_as_ascii(expr, $);
        },
        renderAsInfix(expr: U): string {
            return render_as_infix(expr, $);
        },
        renderAsHuman(expr: U): string {
            return render_as_human(expr, $);
        },
        renderAsLaTeX(expr: U): string {
            return render_as_latex(expr, $);
        },
        renderAsSExpr(expr: U): string {
            return render_as_sexpr(expr, $);
        },
        simplify(expr: U): U {
            return simplify(expr, $);
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

function merge_options(options: ExprTransformOptions | undefined, contextOptions: ScriptContextOptions | undefined): ExprTransformOptions {
    const merged: ExprTransformOptions = {};
    if (contextOptions) {
        if (typeof contextOptions.autoExpand === "boolean") {
            merged.autoExpand = contextOptions.autoExpand;
        }
        if (typeof contextOptions.autoFactor === "boolean") {
            merged.autoFactor = contextOptions.autoFactor;
        }
        if (Array.isArray(contextOptions.disable)) {
            merged.disable = contextOptions.disable;
        }
        if (Array.isArray(contextOptions.enable)) {
            merged.enable = contextOptions.enable;
        }
    }
    if (options) {
        if (typeof options.autoExpand === "boolean") {
            merged.autoExpand = options.autoExpand;
        }
        if (typeof options.autoFactor === "boolean") {
            merged.autoFactor = options.autoFactor;
        }
        if (Array.isArray(options.disable)) {
            merged.disable = options.disable;
        }
        if (Array.isArray(options.enable)) {
            merged.enable = options.enable;
        }
    }
    return merged;
}

/**
 * Makes use of the extension environment because this is called prior to each script execution.
 */
function parse_options_from_script_context_options(options: Pick<ScriptContextOptions, "catchExceptions" | "syntaxKind" | "useIntegersForPredicates"> | undefined, $: ExtensionEnv): ParseOptions {
    if (options) {
        return {
            catchExceptions: options.catchExceptions,
            syntaxKind: options.syntaxKind,
            useCaretForExponentiation: flag_from_directive($.getDirective(Directive.useCaretForExponentiation)),
            useIntegersForPredicates: !!options.useIntegersForPredicates,
            useParenForTensors: flag_from_directive($.getDirective(Directive.useParenForTensors)),
            explicitAssocAdd: false,
            explicitAssocExt: false,
            explicitAssocMul: false
        };
    } else {
        return {
            catchExceptions: false,
            useCaretForExponentiation: false,
            useIntegersForPredicates: false,
            useParenForTensors: false,
            explicitAssocAdd: false,
            explicitAssocExt: false,
            explicitAssocMul: false
        };
    }
}

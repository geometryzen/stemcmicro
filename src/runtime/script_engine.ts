import { define_std_operators } from "../env/define_std_operators";
import { create_env, EnvOptions } from "../env/env";
import { ExtensionEnv, LambdaExpr, SymbolProps } from "../env/ExtensionEnv";
import { useCaretForExponentiation } from "../modes/modes";
import { ParseOptions, SyntaxKind } from "../parser/parser";
import { render_as_ascii } from "../print/render_as_ascii";
import { render_as_human } from "../print/render_as_human";
import { render_as_infix } from "../print/render_as_infix";
import { render_as_latex } from "../print/render_as_latex";
import { render_as_sexpr } from "../print/render_as_sexpr";
import { create_sym, Sym } from "../tree/sym/Sym";
import { U } from "../tree/tree";
import { DEFAULT_MAX_FIXED_PRINTOUT_DIGITS, VARNAME_MAX_FIXED_PRINTOUT_DIGITS } from "./constants";
import { hard_reset } from "./defs";
import { execute_script, transform_tree } from "./execute";
import { execute_definition, execute_std_definitions } from "./init";

export interface ScriptExecuteOptions {
    /**
     * Determines what kind of parser is used for the sourceText.
     */
    syntaxKind?: SyntaxKind
}

export interface ScriptContextOptions extends ScriptExecuteOptions {
    assumes?: { [name: string]: Partial<SymbolProps> };
    dependencies?: string[];
    disable?: string[];
    /**
     * Determines whether the circumflex (caret) character, '^', will be used during parsing to denote exponentiation.
     * The alternative is to use '**', freeing the caret character for use with outer products which is convenient
     * in applications using Geometric Algebra. The default value is false.
     */
    useCaretForExponentiation?: boolean;
    /**
     * @deprecated
     */
    useDefinitions?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function init_env($: ExtensionEnv, options?: ScriptContextOptions) {

    hard_reset();

    $.clearBindings();
    $.clearOperators();

    if (options && options.assumes) {
        // console.lg(JSON.stringify(options.assumes));
        const names = Object.keys(options.assumes);
        for (const name of names) {
            const props = options.assumes[name];
            $.setSymbolProps(create_sym(name), props);
        }
    }

    define_std_operators($);

    $.buildOperators();

    execute_definition(`${VARNAME_MAX_FIXED_PRINTOUT_DIGITS.text}=${DEFAULT_MAX_FIXED_PRINTOUT_DIGITS}`, $);

    if (options && options.useDefinitions) {
        execute_std_definitions($);
    }
}

export function env_term($: ExtensionEnv) {
    $.clearBindings();
    $.clearOperators();
}

export interface ScriptContext {
    clearBindings(): void;
    defineFunction(pattern: U, impl: LambdaExpr): ScriptContext;
    getSymbolProps(sym: Sym | string): SymbolProps;
    getSymbolValue(sym: Sym | string): U;
    getSymbolsInfo(): { sym: Sym, value: U }[]
    evaluate(tree: U): { value: U, prints: string[], errors: Error[] };
    useStandardDefinitions(): void;
    executeScript(sourceText: string, options?: ScriptExecuteOptions): { values: U[], prints: string[], errors: Error[] };
    renderAsAscii(expr: U): string;
    renderAsHuman(expr: U): string;
    renderAsInfix(expr: U): string;
    renderAsLaTeX(expr: U): string;
    renderAsSExpr(expr: U): string;
    addRef(): void;
    release(): void;
}

export function env_options_from_sm_context_options(options: ScriptContextOptions | undefined): EnvOptions {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const hook = function (retval: EnvOptions, description: string): EnvOptions {
        // console.lg(`env_options_from_engine_options(${JSON.stringify(options)}) => ${JSON.stringify(retval)} @ ${description}`);
        return retval;
    };
    if (options) {
        const config: EnvOptions = {
            assumes: options.assumes,
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
            assumes: {},
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
export function create_script_context(contextOptions?: ScriptContextOptions): ScriptContext {
    // console.lg("create_script_context");
    let ref_count = 1;
    const envOptions: EnvOptions = env_options_from_sm_context_options(contextOptions);
    const $ = create_env(envOptions);
    init_env($, contextOptions);
    const theEngine: ScriptContext = {
        clearBindings(): void {
            $.clearBindings();
        },
        defineFunction(pattern: U, impl: LambdaExpr): ScriptContext {
            $.defineFunction(pattern, impl);
            return this;
        },
        getSymbolProps(sym: Sym | string): SymbolProps {
            return $.getSymbolProps(sym);
        },
        getSymbolValue(sym: Sym | string): U {
            return $.getSymbolValue(sym);
        },
        getSymbolsInfo(): { sym: Sym, value: U }[] {
            return $.getSymbolsInfo();
        },
        evaluate(tree: U): { value: U, prints: string[], errors: Error[] } {
            // This is like a fixed pipeline.
            return transform_tree(tree, $);
        },
        useStandardDefinitions(): void {
            execute_std_definitions($);
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        executeScript(sourceText: string, executeOptions: ScriptExecuteOptions): { values: U[], prints: string[], errors: Error[] } {
            const options: Pick<ScriptContextOptions, 'syntaxKind'> = { syntaxKind: SyntaxKind.Native };
            if (contextOptions) {
                if (contextOptions.syntaxKind) {
                    options.syntaxKind = contextOptions.syntaxKind;
                }
            }
            if (executeOptions) {
                if (executeOptions.syntaxKind) {
                    options.syntaxKind = executeOptions.syntaxKind;
                }
            }
            return execute_script("", sourceText, parse_options_from_script_context_options(options, $), $);
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

/**
 * Makes use of the extension environment because this is called prior to each script execution.
 */
function parse_options_from_script_context_options(options: Pick<ScriptContextOptions, 'syntaxKind'> | undefined, $: ExtensionEnv): ParseOptions {
    if (options) {
        return {
            syntaxKind: options.syntaxKind,
            useCaretForExponentiation: $.getModeFlag(useCaretForExponentiation),
            explicitAssocAdd: false,
            explicitAssocMul: false
        };
    }
    else {
        return {
            syntaxKind: SyntaxKind.Native,
            useCaretForExponentiation: false,
            explicitAssocAdd: false,
            explicitAssocMul: false
        };
    }
}

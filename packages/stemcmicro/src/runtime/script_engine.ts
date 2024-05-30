import { create_sym, Sym } from "@stemcmicro/atoms";
import { LambdaExpr } from "@stemcmicro/context";
import { Cons, U } from "@stemcmicro/tree";
import { UndeclaredVars } from "../api/api";
import { define_std_operators } from "../env/define_std_operators";
import { EnvOptions } from "../env/env";
import { ALL_FEATURES, Directive, ExtensionEnv, Predicates } from "../env/ExtensionEnv";
import { move_top_of_stack } from "./defs";

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
            useParenForTensors: options.useParenForTensors
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

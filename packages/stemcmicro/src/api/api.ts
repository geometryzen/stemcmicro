import { Boo, Cell, create_int, create_rat, create_sym, Flt, Keyword, Map, Rat, Str, Sym, Tag, Tensor } from "@stemcmicro/atoms";
import { ExprHandler, LambdaExpr } from "@stemcmicro/context";
import { Native, native_sym } from "@stemcmicro/native";
import { Atom, Cons, items_to_cons, nil, U } from "@stemcmicro/tree";
import { AtomExtensionBuilderFromExprHandlerBuilder } from "../adapters/AtomExtensionBuilderFromExprHandlerBuilder";
import { EmParseOptions } from "../algebrite/em_parse";
import { Scope, Stepper } from "../clojurescript/runtime/Stepper";
import { EigenmathParseConfig } from "../eigenmath/eigenmath";
import { ProgramEnv } from "../eigenmath/ProgramEnv";
import { ProgramStack } from "../eigenmath/ProgramStack";
import { render_svg } from "../eigenmath/render_svg";
import { create_env } from "../env/env";
import { ALL_FEATURES, Directive, directive_from_flag, ExtensionEnv } from "../env/ExtensionEnv";
import { create_algebra_as_blades } from "../operators/algebra/create_algebra_as_tensor";
import { assert_U } from "../operators/helpers/is_any";
import { simplify } from "../operators/simplify/simplify";
import { assert_sym } from "../operators/sym/assert_sym";
import { create_uom, UOM_NAMES } from "../operators/uom/uom";
import { cs_parse, delegate_parse_script, SyntaxKind } from "../parser/parser";
import { render_as_ascii } from "../print/render_as_ascii";
import { render_as_human } from "../print/render_as_human";
import { render_as_infix } from "../print/render_as_infix";
import { render_as_latex } from "../print/render_as_latex";
import { render_as_sexpr } from "../print/render_as_sexpr";
import { execute_script, transform_tree } from "../runtime/execute";
import { RESERVED_KEYWORD_LAST, RESERVED_KEYWORD_TTY } from "../runtime/ns_script";
import { env_term, init_env } from "../runtime/script_engine";
import { visit } from "../visitor/visit";
import { Visitor } from "../visitor/Visitor";

function shallowCopy<T extends object>(source: T): T {
    return {
        ...source
    };
}

export interface ParseConfig {
    useCaretForExponentiation: boolean;
    useParenForTensors: boolean;
    explicitAssocAdd: boolean;
    explicitAssocExt: boolean;
    explicitAssocMul: boolean;
    syntaxKind: SyntaxKind;
}

/**
 * If the option is specified (defined correctly) then use it, otherwise use the default value.
 */
function reify_boolean(optionValue: boolean | undefined, defaultValue: boolean = false): boolean {
    if (typeof optionValue === "boolean") {
        return optionValue;
    } else {
        return defaultValue;
    }
}

export function stemc_parse_config(options: Partial<ParseConfig>): EmParseOptions {
    const config: EmParseOptions = {
        catchExceptions: false,
        explicitAssocAdd: options.explicitAssocAdd,
        explicitAssocExt: options.explicitAssocExt,
        explicitAssocMul: options.explicitAssocMul,
        syntaxKind: options.syntaxKind,
        useCaretForExponentiation: reify_boolean(options.useCaretForExponentiation),
        useParenForTensors: reify_boolean(options.useParenForTensors)
    };
    return config;
}

export function eigenmath_parse_config(options: Partial<ParseConfig>): EigenmathParseConfig {
    return {
        useCaretForExponentiation: reify_boolean(options.useCaretForExponentiation, true),
        useParenForTensors: reify_boolean(options.useParenForTensors, true)
    };
}

export interface RenderConfig {
    format: "Ascii" | "Human" | "Infix" | "LaTeX" | "SExpr" | "SVG";
    useCaretForExponentiation: boolean;
    useParenForTensors: boolean;
}

export enum Concept {
    Last = 1,
    TTY = 2
}

export interface AtomListener {
    reset(from: U, to: U, source: Cell): void;
}

export interface ExprEngineListener {
    output(output: string): void;
}

export interface ExprHandlerBuilder<T extends U> {
    create(): ExprHandler<T>;
}

export interface ExprEngine extends Pick<ProgramEnv, "clearBindings"> {
    clearBindings(): void;
    executeProlog(prolog: string[]): void;
    executeScript(sourceText: string): { values: U[]; prints: string[]; errors: Error[] };

    defineAtomHandler<T extends Atom>(builder: ExprHandlerBuilder<T>, type: string, guard: (expr: Atom) => boolean): void;
    defineFunction(name: Sym, lambda: LambdaExpr): void;

    parse(sourceText: string, options?: Partial<ParseConfig>): { trees: U[]; errors: Error[] };
    parseModule(sourceText: string, options?: Partial<ParseConfig>): { module: Cons; errors: Error[] };

    simplify(expr: U): U;
    valueOf(expr: U): U;

    getBinding(opr: Sym, target: Cons): U;
    hasBinding(opr: Sym, target: Cons): boolean;
    setBinding(opr: Sym, binding: U): void;

    hasUserFunction(name: Sym): boolean;
    getUserFunction(name: Sym): U;
    setUserFunction(name: Sym, userfunc: U): void;

    symbol(concept: Concept): Sym;

    renderAsString(expr: U, config?: Partial<RenderConfig>): string;

    addAtomListener(listener: AtomListener): void;
    removeAtomListener(listener: AtomListener): void;

    addListener(listener: ExprEngineListener): void;
    removeListener(listener: ExprEngineListener): void;

    release(): void;
}

/**
 * This is an implementation detail.
 */
enum EngineKind {
    Micro = 1,
    ClojureScript = 2,
    PythonScript = 3
}

/**
 * Determines the action upon attempts to access an undeclared variable.
 */
export enum UndeclaredVars {
    Err = 1, // ClojureScript
    Nil = 2 // Eigenmath
    // Sym = 3
}

export interface EngineConfig {
    allowUndeclaredVars: UndeclaredVars;
    prolog: string[];
    syntaxKind: SyntaxKind;
    useCaretForExponentiation: boolean;
    useDerivativeShorthandLowerD: boolean;
    useIntegersForPredicates: boolean;
}

function engine_kind_from_engine_options(options: Partial<EngineConfig>): EngineKind {
    if (options.syntaxKind) {
        switch (options.syntaxKind) {
            case SyntaxKind.ClojureScript:
                return EngineKind.ClojureScript;
            case SyntaxKind.Eigenmath:
                return EngineKind.Micro;
            case SyntaxKind.EcmaScript:
                return EngineKind.Micro;
            case SyntaxKind.PythonScript:
                return EngineKind.PythonScript;
        }
    }
    return EngineKind.Micro;
}

class ExtensionEnvVisitor implements Visitor {
    readonly #env: ExtensionEnv;
    constructor(env: ExtensionEnv) {
        this.#env = env;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    beginCons(expr: Cons): void {}
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    endCons(expr: Cons): void {}
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    beginTensor(tensor: Tensor<U>): void {}
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    endTensor(tensor: Tensor<U>): void {}
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    beginMap(map: Map): void {}
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    endMap(map: Map): void {}
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    boo(boo: Boo): void {}
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    keyword(keyword: Keyword): void {}
    sym(name: Sym): void {
        if (!this.#env.hasBinding(name, nil)) {
            this.#env.defineUserSymbol(name);
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    rat(rat: Rat): void {}
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    str(str: Str): void {}
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    tag(tag: Tag): void {}
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    flt(flt: Flt): void {}
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    atom(atom: U): void {}
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    nil(expr: U): void {}
}

function allow_undeclared_vars(options: Partial<EngineConfig>, allowDefault: UndeclaredVars): UndeclaredVars {
    if (typeof options.allowUndeclaredVars === "number") {
        return options.allowUndeclaredVars;
    } else {
        return allowDefault;
    }
}

export function define_math_constant_pi($: ExtensionEnv): void {
    $.setBinding(create_sym("pi"), native_sym(Native.PI));
}

export function define_spacetime_algebra($: ExtensionEnv): void {
    const blades = create_algebra_as_blades([create_int(-1), create_int(1), create_int(1), create_int(1)], ["e0", "e1", "e2", "e3"], $);
    $.setBinding(create_sym("e0"), blades[0]);
    $.setBinding(create_sym("e1"), blades[1]);
    $.setBinding(create_sym("e2"), blades[2]);
    $.setBinding(create_sym("e3"), blades[3]);
}

export function define_geometric30_algebra($: ExtensionEnv): void {
    const blades = create_algebra_as_blades([create_int(1), create_int(1), create_int(1)], ["ex", "ey", "ez"], $);
    $.setBinding(create_sym("ex"), blades[0]);
    $.setBinding(create_sym("ey"), blades[1]);
    $.setBinding(create_sym("ez"), blades[2]);
}

export function define_si_units($: ExtensionEnv): void {
    for (let i = 0; i < UOM_NAMES.length; i++) {
        $.setBinding(create_sym(UOM_NAMES[i]), create_uom(UOM_NAMES[i]));
    }
}

/**
 * https://en.wikipedia.org/wiki/Metric_prefix
 */
export function define_metric_prefixes_for_si_units($: ExtensionEnv): void {
    // d
    const deci = create_rat(1, 10);
    $.setBinding(create_sym("deci"), deci);

    // c
    const centi = create_rat(1, 100);
    $.setBinding(create_sym("centi"), centi);

    // m
    const milli = create_rat(1, 1000);
    $.setBinding(create_sym("milli"), milli);

    // mu
    const micro = milli.mul(milli);
    $.setBinding(create_sym("micro"), micro);

    // n
    const nano = micro.mul(milli);
    $.setBinding(create_sym("nano"), nano);

    // p
    const pico = nano.mul(milli);
    $.setBinding(create_sym("pico"), pico);

    // f
    const femto = pico.mul(milli);
    $.setBinding(create_sym("femto"), femto);

    // a
    const atto = femto.mul(milli);
    $.setBinding(create_sym("atto"), atto);

    // da
    const deka = create_rat(10, 1);
    $.setBinding(create_sym("deka"), deka);

    // h
    const hecto = create_rat(100, 1);
    $.setBinding(create_sym("hecto"), hecto);

    // k
    const kilo = create_rat(1000, 1);
    $.setBinding(create_sym("kilo"), kilo);

    // M
    const mega = kilo.mul(kilo);
    $.setBinding(create_sym("mega"), mega);

    // G
    const giga = mega.mul(kilo);
    $.setBinding(create_sym("giga"), giga);

    // T
    const tera = giga.mul(kilo);
    $.setBinding(create_sym("tera"), tera);

    // P
    const peta = tera.mul(kilo);
    $.setBinding(create_sym("peta"), peta);

    // E
    const exa = peta.mul(kilo);
    $.setBinding(create_sym("exa"), exa);
}

class MicroEngine implements ExprEngine {
    readonly #env: ExtensionEnv;
    readonly #options: Partial<EngineConfig>;
    constructor(options: Partial<EngineConfig>) {
        // console.lg(`options`, JSON.stringify(options));
        this.#options = options;
        this.#env = create_env({
            allowUndeclaredVars: allow_undeclared_vars(options, UndeclaredVars.Nil),
            dependencies: ALL_FEATURES
        });
        init_env(this.#env, {
            allowUndeclaredVars: allow_undeclared_vars(options, UndeclaredVars.Nil),
            useDerivativeShorthandLowerD: options.useDerivativeShorthandLowerD,
            prolog: options.prolog
        });
        define_math_constant_pi(this.#env);
        define_spacetime_algebra(this.#env);
        define_geometric30_algebra(this.#env);
        define_si_units(this.#env);
        define_metric_prefixes_for_si_units(this.#env);
    }
    defineUserSymbol(name: Sym): void {
        this.#env.defineUserSymbol(name);
    }
    handlerFor<T extends U>(expr: T): ExprHandler<T> {
        return this.#env.handlerFor(expr);
    }
    clearBindings(): void {
        this.#env.clearBindings();
    }
    executeProlog(prolog: string[]): void {
        this.#env.executeProlog(prolog);
    }
    executeScript(sourceText: string): { values: U[]; prints: string[]; errors: Error[] } {
        return execute_script(sourceText, this.#options, this.#env);
    }
    hasBinding(opr: Sym, target: Cons): boolean {
        assert_sym(opr);
        return this.#env.hasBinding(opr, target);
    }
    getBinding(opr: Sym, target: Cons): U {
        assert_sym(opr);
        return this.#env.getBinding(opr, target);
    }
    setBinding(opr: Sym, binding: U): void {
        assert_sym(opr);
        this.#env.setBinding(opr, binding);
    }
    hasUserFunction(sym: Sym): boolean {
        assert_sym(sym);
        return this.#env.hasUserFunction(sym);
    }
    getUserFunction(sym: Sym): U {
        assert_sym(sym);
        return this.#env.getUserFunction(sym);
    }
    defineAtomHandler<T extends Atom>(builder: ExprHandlerBuilder<T>, type: string, guard: (expr: Atom) => boolean): void {
        const builderX = new AtomExtensionBuilderFromExprHandlerBuilder<T>(builder, type, guard);
        this.#env.defineExtension(builderX, false);
    }
    defineFunction(name: Sym, lambda: LambdaExpr): void {
        assert_sym(name);
        const match = items_to_cons(name);
        this.#env.defineFunction(match, lambda);
    }
    parse(sourceText: string, options: Partial<ParseConfig> = {}): { trees: U[]; errors: Error[] } {
        this.#env.buildOperators();
        const optionsCopy = shallowCopy(options);
        if (typeof options.syntaxKind === "number") {
            // The user has specified an override.
        } else {
            optionsCopy.syntaxKind = this.#options.syntaxKind;
        }
        const { trees, errors } = delegate_parse_script(sourceText, stemc_parse_config(optionsCopy));
        const visitor = new ExtensionEnvVisitor(this.#env);
        for (const tree of trees) {
            visit(tree, visitor);
        }
        return { trees, errors };
    }
    parseModule(sourceText: string, options: Partial<ParseConfig> = {}): { module: Cons; errors: Error[] } {
        const { trees, errors } = this.parse(sourceText, options);
        const module = items_to_cons(create_sym("module"), ...trees);
        return { module, errors };
    }
    simplify(expr: U): U {
        return simplify(expr, this.#env);
    }
    valueOf(expr: U, stack?: Pick<ProgramStack, "push">): U {
        const { value } = transform_tree(expr, {}, this.#env);
        if (stack) {
            try {
                stack.push(value);
                return nil;
            } finally {
                value.release();
            }
        } else {
            // This seems harmless enough but it causes one unit test to hang.
            // return simplify(value, this.#env);
            return value;
        }
    }
    renderAsString(expr: U, config: Partial<RenderConfig> = {}): string {
        // console.lg("MicroEngine.renderAsString", `${expr}`);
        this.#env.pushDirective(Directive.useCaretForExponentiation, directive_from_flag(config.useCaretForExponentiation));
        this.#env.pushDirective(Directive.useParenForTensors, directive_from_flag(config.useParenForTensors));
        try {
            switch (config.format) {
                case "Ascii": {
                    return render_as_ascii(expr, this.#env);
                }
                case "Human": {
                    return render_as_human(expr, this.#env);
                }
                case "Infix": {
                    return render_as_infix(expr, this.#env);
                }
                case "LaTeX": {
                    return render_as_latex(expr, this.#env);
                }
                case "SExpr": {
                    return render_as_sexpr(expr, this.#env);
                }
                case "SVG": {
                    return render_svg(expr, this.#env, { useImaginaryI: false, useImaginaryJ: false });
                }
                default: {
                    return render_as_infix(expr, this.#env);
                }
            }
        } finally {
            this.#env.popDirective();
            this.#env.popDirective();
        }
    }
    release(): void {
        env_term(this.#env);
    }
    setUserFunction(name: Sym, userfunc: U): void {
        assert_sym(name);
        this.#env.setUserFunction(name, userfunc);
    }
    symbol(concept: Concept): Sym {
        switch (concept) {
            case Concept.Last: {
                return RESERVED_KEYWORD_LAST;
            }
            case Concept.TTY: {
                return RESERVED_KEYWORD_TTY;
            }
            default: {
                throw new Error(`symbol(${concept}) not implemented.`);
            }
        }
    }
    addAtomListener(listener: AtomListener): void {
        this.#env.addAtomListener(listener);
    }
    removeAtomListener(listener: AtomListener): void {
        this.#env.removeAtomListener(listener);
    }
    addListener(listener: ExprEngineListener): void {
        this.#env.listeners.push(listener);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    removeListener(listener: ExprEngineListener): void {}
}

class ClojureScriptEngine implements ExprEngine {
    readonly #env: ExtensionEnv;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(options: Partial<EngineConfig>) {
        // We can wrap #env with a DerivedEnv to evolve to an architecture that supports nested scopes.
        // Wrapping will reveal where there are holes in the implementation.
        const allowUndeclaredVars = allow_undeclared_vars(options, UndeclaredVars.Err);
        const baseEnv = create_env({ allowUndeclaredVars, dependencies: ALL_FEATURES });
        this.#env = baseEnv;
        init_env(this.#env, {
            allowUndeclaredVars,
            useDerivativeShorthandLowerD: options.useDerivativeShorthandLowerD,
            prolog: options.prolog
        });
    }
    defineUserSymbol(name: Sym): void {
        this.#env.defineUserSymbol(name);
    }
    handlerFor<T extends U>(expr: T): ExprHandler<T> {
        return this.#env.handlerFor(expr);
    }
    clearBindings(): void {
        this.#env.clearBindings();
    }
    executeProlog(prolog: string[]): void {
        this.#env.executeProlog(prolog);
    }
    executeScript(sourceText: string): { values: U[]; prints: string[]; errors: Error[] } {
        return execute_script(sourceText, {}, this.#env);
    }
    hasBinding(opr: Sym, target: Cons): boolean {
        assert_sym(opr);
        return this.#env.hasBinding(opr, target);
    }
    hasUserFunction(sym: Sym): boolean {
        assert_sym(sym);
        return this.#env.hasUserFunction(sym);
    }
    getUserFunction(sym: Sym): U {
        assert_sym(sym);
        return this.#env.getUserFunction(sym);
    }
    defineAtomHandler<T extends Atom>(builder: ExprHandlerBuilder<T>, type: string, guard: (expr: Atom) => boolean): void {
        const builderX = new AtomExtensionBuilderFromExprHandlerBuilder<T>(builder, type, guard);
        this.#env.defineExtension(builderX, false);
    }
    defineFunction(name: Sym, lambda: LambdaExpr): void {
        assert_sym(name);
        const match = items_to_cons(name);
        this.#env.defineFunction(match, lambda);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    parse(sourceText: string, options: Partial<ParseConfig> = {}): { trees: U[]; errors: Error[] } {
        this.#env.buildOperators();
        const useCaretForExponentiation = reify_boolean(options.useCaretForExponentiation);
        const caretDecode = useCaretForExponentiation ? native_sym(Native.pow) : native_sym(Native.outer);
        const { trees, errors } = cs_parse(sourceText, {
            lexicon: {
                "^": caretDecode,
                "|": native_sym(Native.inner),
                "<<": native_sym(Native.lco),
                ">>": native_sym(Native.rco)
            }
        });
        const visitor = new ExtensionEnvVisitor(this.#env);
        for (const tree of trees) {
            visit(tree, visitor);
        }
        return { trees, errors };
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    parseModule(sourceText: string, options: Partial<ParseConfig> = {}): { module: Cons; errors: Error[] } {
        const { trees, errors } = this.parse(sourceText, options);
        const module = items_to_cons(create_sym("module"), ...trees);
        return { module, errors };
    }
    getBinding(opr: Sym, target: Cons): U {
        assert_sym(opr);
        return this.#env.getBinding(opr, target);
    }
    setBinding(opr: Sym, binding: U): void {
        assert_sym(opr);
        this.#env.setBinding(opr, binding);
    }
    simplify(expr: U): U {
        return simplify(expr, this.#env);
    }
    valueOf(expr: U, stack?: Pick<ProgramStack, "push">): U {
        const { value } = transform_tree(expr, {}, this.#env);
        if (stack) {
            try {
                stack.push(value);
                return nil;
            } finally {
                value.release();
            }
        } else {
            return value;
        }
    }
    renderAsString(expr: U, config: Partial<RenderConfig> = {}): string {
        assert_U(expr, "ExprEngine.renderAsString(expr, config)", "expr");
        this.#env.pushDirective(Directive.useCaretForExponentiation, directive_from_flag(config.useCaretForExponentiation));
        this.#env.pushDirective(Directive.useParenForTensors, directive_from_flag(config.useParenForTensors));
        try {
            switch (config.format) {
                case "Ascii": {
                    return render_as_ascii(expr, this.#env);
                }
                case "Human": {
                    return render_as_human(expr, this.#env);
                }
                case "Infix": {
                    return render_as_infix(expr, this.#env);
                }
                case "LaTeX": {
                    return render_as_latex(expr, this.#env);
                }
                case "SExpr": {
                    return render_as_sexpr(expr, this.#env);
                }
                case "SVG": {
                    return render_svg(expr, this.#env, { useImaginaryI: false, useImaginaryJ: false });
                }
                default: {
                    return render_as_infix(expr, this.#env);
                }
            }
        } finally {
            this.#env.popDirective();
            this.#env.popDirective();
        }
    }
    release(): void {
        env_term(this.#env);
    }
    setUserFunction(name: Sym, userfunc: U): void {
        assert_sym(name);
        this.#env.setUserFunction(name, userfunc);
    }
    symbol(concept: Concept): Sym {
        switch (concept) {
            case Concept.Last: {
                return RESERVED_KEYWORD_LAST;
            }
            case Concept.TTY: {
                return RESERVED_KEYWORD_TTY;
            }
            default: {
                throw new Error(`symbol(${concept}) not implemented.`);
            }
        }
    }
    addAtomListener(listener: AtomListener): void {
        this.#env.addAtomListener(listener);
    }
    removeAtomListener(listener: AtomListener): void {
        this.#env.removeAtomListener(listener);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    addListener(listener: ExprEngineListener): void {}
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    removeListener(listener: ExprEngineListener): void {}
}

class PythonEngine implements ExprEngine {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(options: Partial<EngineConfig>) {}
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    defineUserSymbol(name: Sym): void {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    handlerFor<T extends U>(expr: T): ExprHandler<T> {
        throw new Error("Method not implemented.");
    }
    clearBindings(): void {
        throw new Error("clearBindings method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    executeProlog(prolog: string[]): void {
        throw new Error("executeProlog method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    executeScript(sourceText: string): { values: U[]; prints: string[]; errors: Error[] } {
        throw new Error("PythonEngine.executeScript method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    hasBinding(sym: Sym): boolean {
        throw new Error("hasBinding method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    hasUserFunction(sym: Sym): boolean {
        throw new Error("hasUserFunction method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getUserFunction(sym: Sym): U {
        throw new Error("getUserFunction method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    defineAtomHandler<T extends Atom>(builder: ExprHandlerBuilder<T>, type: string, guard: (expr: Atom) => boolean): void {
        throw new Error("defineExprHandler method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    defineFunction(name: Sym, lambda: LambdaExpr): void {
        throw new Error("defineFunction method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    parse(sourceText: string, options?: Partial<ParseConfig>): { trees: U[]; errors: Error[] } {
        throw new Error("parse method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    parseModule(sourceText: string, options?: Partial<ParseConfig>): { module: Cons; errors: Error[] } {
        throw new Error("parseModule method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    simplify(expr: U): U {
        throw new Error("simplify method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    valueOf(expr: U): U {
        throw new Error("PythonEngine.valueOf method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getBinding(sym: Sym): U {
        throw new Error("getBinding method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setBinding(sym: Sym, binding: U): void {
        throw new Error("setSymbol method not implemented.");
    }
    release(): void {
        throw new Error("release method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    renderAsString(expr: U, config?: Partial<RenderConfig>): string {
        throw new Error("renderAsString method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setUserFunction(name: Sym, usrfunc: U): void {
        throw new Error("PythonEngine.setUserFunction method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    symbol(concept: Concept): Sym {
        throw new Error("symbol method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    addAtomListener(listener: AtomListener): void {}
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    removeAtomListener(listener: AtomListener): void {}
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    addListener(listener: ExprEngineListener): void {
        throw new Error("addListener method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    removeListener(listener: ExprEngineListener): void {
        throw new Error("removeListener method not implemented.");
    }
}

export function create_engine(options: Partial<EngineConfig> = {}): ExprEngine {
    const engineKind = engine_kind_from_engine_options(options);
    switch (engineKind) {
        case EngineKind.Micro: {
            return new MicroEngine(options);
        }
        case EngineKind.ClojureScript: {
            return new ClojureScriptEngine(options);
        }
        case EngineKind.PythonScript: {
            return new PythonEngine(options);
        }
        default: {
            throw new Error();
        }
    }
}

/**
 * @deprecated
 */
export interface ScriptHandler<T> {
    begin($: T): void;
    output(value: U, input: U, $: T): void;
    text(text: string): void;
    end($: T): void;
}

/**
 * @deprecated
 */
class MyExprEngineListener<T> implements ExprEngineListener {
    constructor(private readonly handler: ScriptHandler<T>) {}
    output(output: string): void {
        this.handler.text(output);
    }
}

/**
 * @deprecated
 */
export class NoopScriptHandler implements ScriptHandler<ExprEngine> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    begin($: ExprEngine): void {}
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    output(_value: U, _input: U, $: ExprEngine): void {}
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    text(text: string): void {}
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    end($: ExprEngine): void {}
}

/**
 * @deprecated
 */
const BLACK_HOLE = new NoopScriptHandler();

/**
 * @deprecated Use ExprEngine.evaluate and the PrintScriptHandler instead.
 */
export function run_script(engine: ExprEngine, inputs: U[], handler: ScriptHandler<ExprEngine> = BLACK_HOLE): void {
    const listen = new MyExprEngineListener(handler);
    engine.addListener(listen);
    handler.begin(engine);
    try {
        for (const input of inputs) {
            const result = engine.valueOf(input);
            handler.output(result, input, engine);
            if (!result.isnil) {
                engine.setBinding(engine.symbol(Concept.Last), result);
            }
        }
    } finally {
        handler.end(engine);
        engine.removeListener(listen);
    }
}

function symbol_from_concept(concept: Concept): Sym {
    switch (concept) {
        case Concept.Last: {
            return RESERVED_KEYWORD_LAST;
        }
        case Concept.TTY: {
            return RESERVED_KEYWORD_TTY;
        }
        default: {
            throw new Error(`symbol(${concept}) not implemented.`);
        }
    }
}

/**
 * This is a proof of concept. Do not expose.
 * @deprecated
 */
export function run_module(module: Cons, handler: ScriptHandler<Stepper>): void {
    const stepper = new Stepper(module);
    const listen: ExprEngineListener = new MyExprEngineListener(handler);
    stepper.addListener(listen);
    handler.begin(stepper);
    try {
        while (stepper.next()) {
            // const state = stepper.getStateStack().top;
            // const $: Scope = state.$;
            // $.getSymbolBindings();
            // console.lg(`${state.node}`);
            // console.lg(`${state.done}`);
        }
        const state = stepper.stack.top;
        const $: Scope = state.$;

        const inputs = state.inputs;
        const values = state.values;
        for (let i = 0; i < values.length; i++) {
            const input = inputs[i];
            const value = values[i];
            handler.output(value, input, stepper);
            if (!value.isnil) {
                $.setBinding(symbol_from_concept(Concept.Last), value);
            }
        }
    } finally {
        handler.end(stepper);
        stepper.removeListener(listen);
    }
}

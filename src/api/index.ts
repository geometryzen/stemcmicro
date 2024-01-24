import { Boo, create_sym, Flt, Keyword, Map, Rat, Str, Sym, Tensor } from 'math-expression-atoms';
import { LambdaExpr } from 'math-expression-context';
import { is_native_sym, Native, native_sym } from 'math-expression-native';
import { Cons, is_nil, items_to_cons, nil, U } from 'math-expression-tree';
import { AlgebriteParseOptions, algebrite_parse } from '../algebrite/algebrite_parse';
import { Scope, Stepper } from '../clojurescript/runtime/Stepper';
import { EigenmathParseConfig, EmitContext, evaluate_expression, get_binding, InfixOptions, iszero, LAST, parse_eigenmath_script, print_result_and_input, render_svg, ScriptErrorHandler, ScriptOutputListener, ScriptVars, set_symbol, to_infix, to_sexpr, TTY } from '../eigenmath';
import { create_env } from '../env/env';
import { ALL_FEATURES, Directive, ExtensionEnv } from '../env/ExtensionEnv';
import { clojurescript_parse, SyntaxKind } from '../parser/parser';
import { render_as_ascii } from '../print/render_as_ascii';
import { render_as_human } from '../print/render_as_human';
import { render_as_infix } from '../print/render_as_infix';
import { render_as_latex } from '../print/render_as_latex';
import { render_as_sexpr } from '../print/render_as_sexpr';
import { transform_tree } from '../runtime/execute';
import { RESERVED_KEYWORD_LAST, RESERVED_KEYWORD_TTY } from '../runtime/ns_script';
import { env_term, init_env } from '../runtime/script_engine';
import { visit } from '../visitor/visit';
import { Visitor } from '../visitor/Visitor';

export interface ParseConfig {
    useCaretForExponentiation: boolean;
    useGeometricAlgebra: boolean;
    useParenForTensors: boolean;
}

export function algebrite_parse_config(options: Partial<ParseConfig>): AlgebriteParseOptions {
    const config: AlgebriteParseOptions = {
        catchExceptions: false,
        explicitAssocAdd: false,
        explicitAssocMul: false,
        useCaretForExponentiation: !!options.useCaretForExponentiation,
        useParenForTensors: !!options.useParenForTensors
    };
    return config;
}

export function eigenmath_parse_config(options: Partial<ParseConfig>): EigenmathParseConfig {
    return {
        useCaretForExponentiation: !!options.useCaretForExponentiation,
        useParenForTensors: !!options.useParenForTensors
    };
}

export class EigenmathErrorHandler implements ScriptErrorHandler {
    errors: Error[] = [];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    error(inbuf: string, start: number, end: number, err: unknown, $: ScriptVars): void {
        this.errors.push(new Error(`${err}`));
    }
}

export interface RenderConfig {
    format: 'Ascii' | 'Human' | 'Infix' | 'LaTeX' | 'SExpr' | 'SVG';
    useCaretForExponentiation: boolean;
    useParenForTensors: boolean;
}

export enum Concept {
    Last = 1,
    TTY = 2
}

export interface ExprEngineListener {
    output(output: string): void;
}

export interface ExprEngine {
    defineFunction(name: string, lambda: LambdaExpr): void;
    parse(sourceText: string, options?: Partial<ParseConfig>): { trees: U[], errors: Error[] };
    parseModule(sourceText: string, options?: Partial<ParseConfig>): { module: Cons, errors: Error[] };
    evaluate(expr: U): U;
    getBinding(sym: Sym): U;
    isConsSymbol(sym: Sym): boolean;
    isUserSymbol(sym: Sym): boolean;
    release(): void;
    renderAsString(expr: U, config?: Partial<RenderConfig>): string;
    setSymbol(sym: Sym, binding: U, usrfunc: U): void;
    symbol(concept: Concept): Sym;
    addListener(listener: ExprEngineListener): void;
    removeListener(listener: ExprEngineListener): void;
}

/**
 * This is an implementation detail. 
 */
enum EngineKind {
    Algebrite = 1,
    Eigenmath = 2,
    ClojureScript = 3,
    PythonScript = 4
}

export interface EngineConfig {
    syntaxKind: SyntaxKind;
    prolog: string[];
    useGeometricAlgebra: boolean;
    useClojureScript: boolean;
    usePythonScript: boolean;
}

function engine_kind_from_engine_options(options: Partial<EngineConfig>): EngineKind {
    if (options.syntaxKind) {
        switch (options.syntaxKind) {
            case SyntaxKind.Algebrite: {
                return EngineKind.Algebrite;
            }
            case SyntaxKind.ClojureScript: {
                return EngineKind.ClojureScript;
            }
            case SyntaxKind.Eigenmath: {
                return EngineKind.Eigenmath;
            }
            case SyntaxKind.PythonScript: {
                return EngineKind.PythonScript;
            }
            default: {
                // Fall through for backwards compatibility.
            }
        }
    }
    // Backwards Compatibility
    if (options.useClojureScript) {
        return EngineKind.ClojureScript;
    }
    else if (options.usePythonScript) {
        return EngineKind.PythonScript;
    }
    else {
        if (options.useGeometricAlgebra) {
            return EngineKind.Algebrite;
        }
        else {
            return EngineKind.Eigenmath;
        }
    }
}

class ExtensionEnvVisitor implements Visitor {
    readonly #env: ExtensionEnv;
    constructor(env: ExtensionEnv) {
        this.#env = env;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    beginCons(expr: Cons): void {
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    endCons(expr: Cons): void {
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    beginTensor(tensor: Tensor<U>): void {
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    endTensor(tensor: Tensor<U>): void {
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    beginMap(map: Map): void {
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    endMap(map: Map): void {
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    boo(boo: Boo): void {
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    keyword(keyword: Keyword): void {
    }
    sym(sym: Sym): void {
        if (!this.#env.isConsSymbol(sym)) {
            this.#env.defineUserSymbol(sym);
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    rat(rat: Rat): void {
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    str(str: Str): void {
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    flt(flt: Flt): void {
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    atom(atom: U): void {
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    nil(expr: U): void {
    }
}

class AlgebriteExprEngine implements ExprEngine {
    readonly #env: ExtensionEnv;
    constructor(options: Partial<EngineConfig>) {
        this.#env = create_env({
            dependencies: ALL_FEATURES
        });
        init_env(this.#env, {
            prolog: options.prolog
        });
    }
    isConsSymbol(sym: Sym): boolean {
        const answer: boolean = this.#env.isConsSymbol(sym);
        // console.lg(`AlgebriteExprEngine.isConsSymbol ${sym} => ${answer}`);
        return answer;
    }
    isUserSymbol(sym: Sym): boolean {
        const answer: boolean = this.#env.isUserSymbol(sym);
        // console.lg(`AlgebriteExprEngine.isUserSymbol ${sym} => ${answer}`);
        return answer;
    }
    defineFunction(name: string, lambda: LambdaExpr): void {
        const match = items_to_cons(create_sym(name));
        this.#env.defineFunction(match, lambda);
    }
    parse(sourceText: string, options: Partial<ParseConfig> = {}): { trees: U[]; errors: Error[]; } {
        const { trees, errors } = algebrite_parse(sourceText, algebrite_parse_config(options));
        const visitor = new ExtensionEnvVisitor(this.#env);
        for (const tree of trees) {
            visit(tree, visitor);
        }
        return { trees, errors };
    }
    parseModule(sourceText: string, options: Partial<ParseConfig> = {}): { module: Cons; errors: Error[]; } {
        const { trees, errors } = this.parse(sourceText, options);
        const module = items_to_cons(create_sym('module'), ...trees);
        return { module, errors };
    }
    getBinding(sym: Sym): U {
        return this.#env.getBinding(sym);
    }
    evaluate(expr: U): U {
        const { value } = transform_tree(expr, {}, this.#env);
        return value;
    }
    renderAsString(expr: U, config: Partial<RenderConfig> = {}): string {
        this.#env.pushDirective(Directive.useCaretForExponentiation, !!config.useCaretForExponentiation);
        this.#env.pushDirective(Directive.useParenForTensors, !!config.useParenForTensors);
        try {
            switch (config.format) {
                case 'Ascii': {
                    return render_as_ascii(expr, this.#env);
                }
                case 'Human': {
                    return render_as_human(expr, this.#env);
                }
                case 'Infix': {
                    return render_as_infix(expr, this.#env);
                }
                case 'LaTeX': {
                    return render_as_latex(expr, this.#env);
                }
                case 'SExpr': {
                    return render_as_sexpr(expr, this.#env);
                }
                case 'SVG': {
                    return render_svg(expr, { useImaginaryI: false, useImaginaryJ: false }, this.#env);
                }
                default: {
                    return render_as_infix(expr, this.#env);
                }
            }
        }
        finally {
            this.#env.popDirective();
            this.#env.popDirective();
        }
    }
    release(): void {
        env_term(this.#env);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setSymbol(sym: Sym, binding: U, usrfunc: U): void {
        this.#env.setBinding(sym, binding);
        this.#env.setUsrFunc(sym, usrfunc);
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    addListener(listener: ExprEngineListener): void {
        // The native engine currently does not support listeners.
        // throw new Error('addListener() method not implemented.');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    removeListener(listener: ExprEngineListener): void {
        // throw new Error('removeListener() method not implemented.');
    }
}
class ClojureScriptExprEngine implements ExprEngine {
    readonly #env: ExtensionEnv;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(options: Partial<EngineConfig>) {
        this.#env = create_env({
            dependencies: ALL_FEATURES
        });
        init_env(this.#env, {
            prolog: options.prolog
        });
    }
    isConsSymbol(sym: Sym): boolean {
        return this.#env.isConsSymbol(sym);
    }
    isUserSymbol(sym: Sym): boolean {
        return this.#env.isUserSymbol(sym);
    }
    defineFunction(name: string, lambda: LambdaExpr): void {
        const match = items_to_cons(create_sym(name));
        this.#env.defineFunction(match, lambda);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    parse(sourceText: string, options: Partial<ParseConfig> = {}): { trees: U[]; errors: Error[]; } {
        const { trees, errors } = clojurescript_parse(sourceText, {
            lexicon: {
                '^': native_sym(Native.outer),
                '|': native_sym(Native.inner),
                '<<': native_sym(Native.lco),
                '>>': native_sym(Native.rco)
            }
        });
        const visitor = new ExtensionEnvVisitor(this.#env);
        for (const tree of trees) {
            visit(tree, visitor);
        }
        return { trees, errors };
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    parseModule(sourceText: string, options: Partial<ParseConfig> = {}): { module: Cons; errors: Error[]; } {
        const { trees, errors } = this.parse(sourceText, options);
        const module = items_to_cons(create_sym('module'), ...trees);
        return { module, errors };
    }
    getBinding(sym: Sym): U {
        return this.#env.getBinding(sym);
    }
    evaluate(expr: U): U {
        const { value } = transform_tree(expr, {}, this.#env);
        return value;
    }
    renderAsString(expr: U, config: Partial<RenderConfig> = {}): string {
        this.#env.pushDirective(Directive.useCaretForExponentiation, !!config.useCaretForExponentiation);
        this.#env.pushDirective(Directive.useParenForTensors, !!config.useParenForTensors);
        try {
            switch (config.format) {
                case 'Ascii': {
                    return render_as_ascii(expr, this.#env);
                }
                case 'Human': {
                    return render_as_human(expr, this.#env);
                }
                case 'Infix': {
                    return render_as_infix(expr, this.#env);
                }
                case 'LaTeX': {
                    return render_as_latex(expr, this.#env);
                }
                case 'SExpr': {
                    return render_as_sexpr(expr, this.#env);
                }
                case 'SVG': {
                    return render_svg(expr, { useImaginaryI: false, useImaginaryJ: false }, this.#env);
                }
                default: {
                    return render_as_infix(expr, this.#env);
                }
            }
        }
        finally {
            this.#env.popDirective();
            this.#env.popDirective();
        }
    }
    release(): void {
        env_term(this.#env);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setSymbol(sym: Sym, binding: U, usrfunc: U): void {
        this.#env.setBinding(sym, binding);
        this.#env.setUsrFunc(sym, usrfunc);
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    addListener(listener: ExprEngineListener): void {
        // The native engine currently does not support listeners.
        // throw new Error('addListener() method not implemented.');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    removeListener(listener: ExprEngineListener): void {
        // throw new Error('removeListener() method not implemented.');
    }
}

function eigenmath_infix_config(config: Partial<RenderConfig>): InfixOptions {
    const options: InfixOptions = {
        useCaretForExponentiation: !!config.useCaretForExponentiation,
        useParenForTensors: !!config.useParenForTensors
    };
    return options;
}

class EigenmathOutputListener implements ScriptOutputListener {
    constructor(private readonly inner: ExprEngineListener) {

    }
    output(output: string): void {
        this.inner.output(output);
    }
}

class EigenmathExprEngine implements ExprEngine {
    readonly #env: ScriptVars = new ScriptVars();
    constructor(options: Partial<EngineConfig>) {
        // Determine whether options requested are compatible with Eigenmath.
        this.#env.init();
        if (options.prolog) {
            if (Array.isArray(options.prolog)) {
                this.#env.executeProlog(options.prolog);
            }
            else {
                throw new Error("prolog must be string[]");
            }
        }
    }
    defineFunction(name: string, lambda: LambdaExpr): void {
        this.#env.defineFunction(name, lambda);
    }
    parse(sourceText: string, options: Partial<ParseConfig> = {}): { trees: U[]; errors: Error[]; } {
        const emErrorHandler = new EigenmathErrorHandler();
        const trees: U[] = parse_eigenmath_script(sourceText, eigenmath_parse_config(options), emErrorHandler, this.#env);
        return { trees, errors: emErrorHandler.errors };
    }
    parseModule(sourceText: string, options: Partial<ParseConfig> = {}): { module: Cons; errors: Error[]; } {
        const emErrorHandler = new EigenmathErrorHandler();
        const trees: U[] = parse_eigenmath_script(sourceText, eigenmath_parse_config(options), emErrorHandler, this.#env);
        const module = items_to_cons(create_sym('module'), ...trees);
        return { module, errors: emErrorHandler.errors };
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getBinding(sym: Sym): U {
        return get_binding(sym, this.#env);
    }
    isConsSymbol(sym: Sym): boolean {
        const answer: boolean = this.#env.isConsSymbol(sym);
        // console.lg(`EigenmathExprEngine.isConsSymbol ${sym} => ${answer}`);
        return answer;
    }
    isUserSymbol(sym: Sym): boolean {
        const answer: boolean = this.#env.isUserSymbol(sym);
        // console.lg(`EigenmathExprEngine.isUserSymbol ${sym} => ${answer}`);
        return answer;

    }
    evaluate(expr: U): U {
        return evaluate_expression(expr, this.#env);
    }
    renderAsString(expr: U, config: Partial<RenderConfig> = {}): string {
        switch (config.format) {
            case 'Ascii': {
                // TODO
                return to_infix(expr, eigenmath_infix_config(config));
            }
            case 'Human': {
                // TODO
                return to_infix(expr, eigenmath_infix_config(config));
            }
            case 'Infix': {
                return to_infix(expr, eigenmath_infix_config(config));
            }
            case 'LaTeX': {
                // TODO: Eigenmath can't do LaTeX.
                throw new Error("Eigenmath can't do LaTeX.");
                // TODO: Make render_as_latex more reusable.
                // return render_as_latex(expr, this.$);
            }
            case 'SExpr': {
                return to_sexpr(expr);
            }
            case 'SVG': {
                return render_svg(expr, { useImaginaryI: false, useImaginaryJ: false }, this.#env);
            }
            default: {
                return to_infix(expr, eigenmath_infix_config(config));
            }
        }
    }
    release(): void {
        // Do nothing (yet).
    }
    setSymbol(sym: Sym, binding: U, usrfunc: U): void {
        set_symbol(sym, binding, usrfunc, this.#env);
    }
    symbol(concept: Concept): Sym {
        switch (concept) {
            case Concept.Last: {
                return LAST;
            }
            case Concept.TTY: {
                return TTY;
            }
            default: {
                throw new Error(`symbol(${concept}) not implemented.`);
            }
        }
    }
    addListener(listener: ExprEngineListener): void {
        this.#env.addOutputListener(new EigenmathOutputListener(listener));
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    removeListener(listener: ExprEngineListener): void {
        // This doesn't work because we've lost the identity of the adapter.
        this.#env.removeOutputListener(new EigenmathOutputListener(listener));
    }
}

class PythonExprEngine implements ExprEngine {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(options: Partial<EngineConfig>) {

    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isConsSymbol(sym: Sym): boolean {
        throw new Error('isConsSymbol method not implemented.');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isUserSymbol(sym: Sym): boolean {
        throw new Error('isUserSymbol method not implemented.');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    defineFunction(name: string, lambda: LambdaExpr): void {
        throw new Error('defineFunction method not implemented.');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    parse(sourceText: string, options?: Partial<ParseConfig>): { trees: U[]; errors: Error[]; } {
        throw new Error('parse method not implemented.');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    parseModule(sourceText: string, options?: Partial<ParseConfig>): { module: Cons; errors: Error[]; } {
        throw new Error('parseModule method not implemented.');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    evaluate(expr: U): U {
        throw new Error('evaluate method not implemented.');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getBinding(sym: Sym): U {
        throw new Error('getBinding method not implemented.');
    }
    release(): void {
        throw new Error('release method not implemented.');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    renderAsString(expr: U, config?: Partial<RenderConfig>): string {
        throw new Error('renderAsString method not implemented.');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setSymbol(sym: Sym, binding: U, usrfunc: U): void {
        throw new Error('setSymbol method not implemented.');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    symbol(concept: Concept): Sym {
        throw new Error('symbol method not implemented.');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    addListener(listener: ExprEngineListener): void {
        throw new Error('addListener method not implemented.');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    removeListener(listener: ExprEngineListener): void {
        throw new Error('removeListener method not implemented.');
    }
}

export function create_engine(options: Partial<EngineConfig> = {}): ExprEngine {
    const engineKind = engine_kind_from_engine_options(options);
    switch (engineKind) {
        case EngineKind.Algebrite: {
            return new AlgebriteExprEngine(options);
        }
        case EngineKind.ClojureScript: {
            return new ClojureScriptExprEngine(options);
        }
        case EngineKind.Eigenmath: {
            return new EigenmathExprEngine(options);
        }
        case EngineKind.PythonScript: {
            return new PythonExprEngine(options);
        }
        default: {
            throw new Error();
        }
    }
}

export interface ScriptHandler<T> {
    begin($: T): void;
    output(value: U, input: U, $: T): void;
    text(text: string): void;
    end($: T): void;
}

class MyExprEngineListener<T> implements ExprEngineListener {
    constructor(private readonly handler: ScriptHandler<T>) {

    }
    output(output: string): void {
        this.handler.text(output);
    }
}

export class NoopScriptHandler implements ScriptHandler<ExprEngine> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    begin($: ExprEngine): void { }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    output(_value: U, _input: U, $: ExprEngine): void { }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    text(text: string): void { }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    end($: ExprEngine): void { }
}

const BLACK_HOLE = new NoopScriptHandler();

export function run_script(engine: ExprEngine, inputs: U[], handler: ScriptHandler<ExprEngine> = BLACK_HOLE): void {
    const listen = new MyExprEngineListener(handler);
    engine.addListener(listen);
    handler.begin(engine);
    try {
        for (const input of inputs) {
            const result = engine.evaluate(input);
            handler.output(result, input, engine);
            if (!is_nil(result)) {
                engine.setSymbol(engine.symbol(Concept.Last), result, nil);
            }
        }
    }
    finally {
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
            if (!is_nil(value)) {
                $.setSymbolBinding(symbol_from_concept(Concept.Last), value);
            }
        }
    }
    finally {
        handler.end(stepper);
        stepper.removeListener(listen);
    }
}

/**
 * An adapter for the print_result_and_output(...) function.
 */
class PrintScriptListener implements ScriptOutputListener {
    // TODO: This class only really needs stdout.
    // TODO: This class could be the correct location for HTML escaping.
    constructor(private readonly outer: PrintScriptHandler) {
    }
    output(output: string): void {
        this.outer.stdout.innerHTML += output;
    }
}

export class PrintScriptHandler implements ScriptHandler<ExprEngine> {
    constructor(readonly stdout: HTMLElement) {
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    begin($: ExprEngine): void {
        this.stdout.innerHTML = "";
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    end($: ExprEngine): void {
        // $.removeListener(this.listener);
    }
    output(value: U, input: U, $: ExprEngine): void {
        const ec: EmitContext = {
            useImaginaryI: true,//isimaginaryunit(get_binding(symbol(I_LOWER), $)),
            useImaginaryJ: false,//isimaginaryunit(get_binding(symbol(J_LOWER), $))
        };
        // 
        const listener = new PrintScriptListener(this);
        function should_annotate_symbol(x: Sym, value: U): boolean {
            if ($.isUserSymbol(x)) {
                if (x.equals(value) || is_nil(value)) {
                    return false;
                }
                /*
                if (x.equals(I_LOWER) && isimaginaryunit(value))
                    return false;
        
                if (x.equals(J_LOWER) && isimaginaryunit(value))
                    return false;
                */

                return true;
            }
            else {
                if (is_native_sym(x)) {
                    return false;
                }
                else {
                    return true;
                }
            }
        }
        print_result_and_input(value, input, should_render_svg($), ec, [listener], should_annotate_symbol, $);
    }
    text(text: string): void {
        this.stdout.innerHTML += text;
    }
}

export function should_render_svg($: ExprEngine): boolean {
    const sym = $.symbol(Concept.TTY);
    const tty = $.getBinding(sym);
    if (is_nil(tty)) {
        // Unbound in Native engine.
        return true;
    }
    else if (tty.equals(sym)) {
        // Unbound in Eigenmath engine.
        return true;
    }
    else if (iszero(tty)) {
        // Bound to zero.
        return true;
    }
    else {
        return false;
    }
}
/*
export function should_stepper_render_svg(stepper: Stepper): boolean {
    const $: Scope = stepper.getStateStack().top.$;
    const sym: Sym = $.symbol(Concept.TTY);
    const tty = $.getSymbolBinding(sym);
    if (is_nil(tty)) {
        // Unbound in Native engine.
        return true;
    }
    else if (tty.equals(sym)) {
        // Unbound in Eigenmath engine.
        return true;
    }
    else if (iszero(tty)) {
        // Bound to zero.
        return true;
    }
    else {
        return false;
    }
}
*/

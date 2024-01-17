import { create_sym, Sym } from 'math-expression-atoms';
import { LambdaExpr } from 'math-expression-context';
import { Cons, is_nil, items_to_cons, nil, U } from 'math-expression-tree';
import { clojurescript_parse } from '../clojurescript/parser/clojurescript_parse';
import { Scope, Stepper } from '../clojurescript/runtime/Stepper';
import { EigenmathParseConfig, EmitContext, evaluate_expression, get_binding, InfixOptions, init, initscript, iszero, LAST, parse_eigenmath_script, print_result_and_input, render_svg, ScriptErrorHandler, ScriptOutputListener, ScriptVars, set_symbol, to_infix, to_sexpr, TTY } from '../eigenmath';
import { create_env } from '../env/env';
import { Directive, ExtensionEnv } from '../env/ExtensionEnv';
import { delegate_parse_script, ParseOptions, SyntaxKind } from '../parser/parser';
import { render_as_ascii } from '../print/render_as_ascii';
import { render_as_human } from '../print/render_as_human';
import { render_as_infix } from '../print/render_as_infix';
import { render_as_latex } from '../print/render_as_latex';
import { render_as_sexpr } from '../print/render_as_sexpr';
import { transform_tree } from '../runtime/execute';
import { RESERVED_KEYWORD_LAST, RESERVED_KEYWORD_TTY } from '../runtime/ns_script';
import { env_term, init_env } from '../runtime/script_engine';

export interface ParseConfig {
    useCaretForExponentiation: boolean;
    useGeometricAlgebra: boolean;
    useParenForTensors: boolean;
}

function native_parse_config(options: Partial<ParseConfig>): ParseOptions {
    return {
        useCaretForExponentiation: !!options.useCaretForExponentiation,
        useParenForTensors: !!options.useParenForTensors
    };
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
    useGeometricAlgebra: boolean;
    syntaxKind: SyntaxKind;
    useClojureScript: boolean;
    usePythonScript: boolean;
}

function engine_kind_from_eval_config(config: Partial<EngineConfig>): EngineKind {
    // FIXME: Needs to be more orthogonal. 
    if (config.useClojureScript) {
        return EngineKind.ClojureScript;
    }
    else if (config.usePythonScript) {
        return EngineKind.PythonScript;
    }
    else {
        if (config.useGeometricAlgebra) {
            return EngineKind.Algebrite;
        }
        else {
            return EngineKind.Eigenmath;
        }
    }
}

class ClojureScriptExprEngine implements ExprEngine {
    $: ExtensionEnv;
    constructor() {
        this.$ = create_env({
            dependencies: ['Blade', 'Flt', 'Imu', 'Uom', 'Vector']
        });
        init_env(this.$, {
            useDefinitions: false
        });
    }
    defineFunction(name: string, lambda: LambdaExpr): void {
        const match = items_to_cons(create_sym(name));
        this.$.defineFunction(match, lambda);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    parse(sourceText: string, options: Partial<ParseConfig> = {}): { trees: U[]; errors: Error[]; } {
        return clojurescript_parse(sourceText, {
            lexicon: {}
        });
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    parseModule(sourceText: string, options: Partial<ParseConfig> = {}): { module: Cons; errors: Error[]; } {
        const { trees, errors } = clojurescript_parse(sourceText, {
            lexicon: {}
        });
        const module = items_to_cons(create_sym('module'), ...trees);
        return { module, errors };
    }
    getBinding(sym: Sym): U {
        return this.$.getBinding(sym.key());
    }
    evaluate(expr: U): U {
        const { value } = transform_tree(expr, {}, this.$);
        return value;
    }
    renderAsString(expr: U, config: Partial<RenderConfig> = {}): string {
        this.$.pushDirective(Directive.useCaretForExponentiation, !!config.useCaretForExponentiation);
        this.$.pushDirective(Directive.useParenForTensors, !!config.useParenForTensors);
        try {
            switch (config.format) {
                case 'Ascii': {
                    return render_as_ascii(expr, this.$);
                }
                case 'Human': {
                    return render_as_human(expr, this.$);
                }
                case 'Infix': {
                    return render_as_infix(expr, this.$);
                }
                case 'LaTeX': {
                    return render_as_latex(expr, this.$);
                }
                case 'SExpr': {
                    return render_as_sexpr(expr, this.$);
                }
                case 'SVG': {
                    return render_svg(expr, { useImaginaryI: false, useImaginaryJ: false });
                }
                default: {
                    return render_as_infix(expr, this.$);
                }
            }
        }
        finally {
            this.$.popDirective();
            this.$.popDirective();
        }
    }
    release(): void {
        env_term(this.$);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setSymbol(sym: Sym, binding: U, usrfunc: U): void {
        this.$.setBinding(sym.key(), binding);
        this.$.setUsrFunc(sym.key(), usrfunc);
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
        // throw new Error('addListener() Method not implemented.');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    removeListener(listener: ExprEngineListener): void {
        // throw new Error('removeListener() Method not implemented.');
    }
}

class AlgebriteExprEngine implements ExprEngine {
    $: ExtensionEnv;
    constructor() {
        this.$ = create_env({
            dependencies: ['Blade', 'Flt', 'Imu', 'Uom', 'Vector']
        });
        init_env(this.$, {
            useDefinitions: false
        });
    }
    defineFunction(name: string, lambda: LambdaExpr): void {
        const match = items_to_cons(create_sym(name));
        this.$.defineFunction(match, lambda);
    }
    parse(sourceText: string, options: Partial<ParseConfig> = {}): { trees: U[]; errors: Error[]; } {
        // Don't go through the delegate.
        return delegate_parse_script(sourceText, native_parse_config(options));
    }
    parseModule(sourceText: string, options: Partial<ParseConfig> = {}): { module: Cons; errors: Error[]; } {
        // Don't fo through delegate.
        const { trees, errors } = delegate_parse_script(sourceText, native_parse_config(options));
        const module = items_to_cons(create_sym('module'), ...trees);
        return { module, errors };
    }
    getBinding(sym: Sym): U {
        return this.$.getBinding(sym.key());
    }
    evaluate(expr: U): U {
        const { value } = transform_tree(expr, {}, this.$);
        return value;
    }
    renderAsString(expr: U, config: Partial<RenderConfig> = {}): string {
        this.$.pushDirective(Directive.useCaretForExponentiation, !!config.useCaretForExponentiation);
        this.$.pushDirective(Directive.useParenForTensors, !!config.useParenForTensors);
        try {
            switch (config.format) {
                case 'Ascii': {
                    return render_as_ascii(expr, this.$);
                }
                case 'Human': {
                    return render_as_human(expr, this.$);
                }
                case 'Infix': {
                    return render_as_infix(expr, this.$);
                }
                case 'LaTeX': {
                    return render_as_latex(expr, this.$);
                }
                case 'SExpr': {
                    return render_as_sexpr(expr, this.$);
                }
                case 'SVG': {
                    return render_svg(expr, { useImaginaryI: false, useImaginaryJ: false });
                }
                default: {
                    return render_as_infix(expr, this.$);
                }
            }
        }
        finally {
            this.$.popDirective();
            this.$.popDirective();
        }
    }
    release(): void {
        env_term(this.$);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setSymbol(sym: Sym, binding: U, usrfunc: U): void {
        this.$.setBinding(sym.key(), binding);
        this.$.setUsrFunc(sym.key(), usrfunc);
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
        // throw new Error('addListener() Method not implemented.');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    removeListener(listener: ExprEngineListener): void {
        // throw new Error('removeListener() Method not implemented.');
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
    private readonly $: ScriptVars = new ScriptVars();
    constructor() {
        init(this.$);
        initscript(this.$);
    }
    defineFunction(name: string, lambda: LambdaExpr): void {
        this.$.defineFunction(name, lambda);
    }
    parse(sourceText: string, options: Partial<ParseConfig> = {}): { trees: U[]; errors: Error[]; } {
        const emErrorHandler = new EigenmathErrorHandler();
        const trees: U[] = parse_eigenmath_script(sourceText, eigenmath_parse_config(options), emErrorHandler);
        return { trees, errors: emErrorHandler.errors };
    }
    parseModule(sourceText: string, options: Partial<ParseConfig> = {}): { module: Cons; errors: Error[]; } {
        const emErrorHandler = new EigenmathErrorHandler();
        const trees: U[] = parse_eigenmath_script(sourceText, eigenmath_parse_config(options), emErrorHandler);
        const module = items_to_cons(create_sym('module'), ...trees);
        return { module, errors: emErrorHandler.errors };
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getBinding(sym: Sym): U {
        return get_binding(sym, this.$);
    }
    evaluate(expr: U): U {
        return evaluate_expression(expr, this.$);
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
                // TODO
                return to_infix(expr, eigenmath_infix_config(config));
            }
            case 'SExpr': {
                return to_sexpr(expr);
            }
            case 'SVG': {
                return render_svg(expr, { useImaginaryI: false, useImaginaryJ: false });
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
        set_symbol(sym, binding, usrfunc, this.$);
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
        this.$.addOutputListener(new EigenmathOutputListener(listener));
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    removeListener(listener: ExprEngineListener): void {
        // This doesn't work because we've lost the identity of the adapter.
        this.$.removeOutputListener(new EigenmathOutputListener(listener));
    }
}

class PythonExprEngine implements ExprEngine {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    defineFunction(name: string, lambda: LambdaExpr): void {
        throw new Error('Method not implemented.');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    parse(sourceText: string, options?: Partial<ParseConfig>): { trees: U[]; errors: Error[]; } {
        throw new Error('Method not implemented.');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    parseModule(sourceText: string, options?: Partial<ParseConfig>): { module: Cons; errors: Error[]; } {
        throw new Error('Method not implemented.');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    evaluate(expr: U): U {
        throw new Error('Method not implemented.');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getBinding(sym: Sym): U {
        throw new Error('Method not implemented.');
    }
    release(): void {
        throw new Error('Method not implemented.');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    renderAsString(expr: U, config?: Partial<RenderConfig>): string {
        throw new Error('Method not implemented.');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setSymbol(sym: Sym, binding: U, usrfunc: U): void {
        throw new Error('Method not implemented.');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    symbol(concept: Concept): Sym {
        throw new Error('Method not implemented.');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    addListener(listener: ExprEngineListener): void {
        throw new Error('Method not implemented.');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    removeListener(listener: ExprEngineListener): void {
        throw new Error('Method not implemented.');
    }
}

export function create_engine(config: Partial<EngineConfig> = {}): ExprEngine {
    const engineKind = engine_kind_from_eval_config(config);
    switch (engineKind) {
        case EngineKind.Algebrite: {
            return new AlgebriteExprEngine();
        }
        case EngineKind.ClojureScript: {
            return new ClojureScriptExprEngine();
        }
        case EngineKind.Eigenmath: {
            return new EigenmathExprEngine();
        }
        case EngineKind.PythonScript: {
            return new PythonExprEngine();
        }
        default: {
            throw new Error(`Unexpected options.syntaxKind`);
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

export function run_script(engine: ExprEngine, inputs: U[], handler: ScriptHandler<ExprEngine>): void {
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
            // console.log(`${state.node}`);
            // console.log(`${state.done}`);
        }
        const state = stepper.getStateStack().top;
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
        print_result_and_input(value, input, should_render_svg($), ec, [listener]);
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

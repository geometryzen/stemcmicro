import { Sym } from 'math-expression-atoms';
import { is_nil, nil, U } from 'math-expression-tree';
import { EigenmathParseConfig, EmitContext, evaluate_expression, get_binding, InfixOptions, init, initscript, iszero, LAST, parse_eigenmath_script, print_result_and_input, ScriptErrorHandler, ScriptOutputListener, ScriptVars, set_symbol, symbol, to_infix, TTY } from '../eigenmath';
import { create_env } from '../env/env';
import { Directive, ExtensionEnv } from '../env/ExtensionEnv';
import { ParseOptions, parse_native_script } from '../parser/parser';
import { render_as_infix } from '../print/render_as_infix';
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

function eigenmath_parse_config(options: Partial<ParseConfig>): EigenmathParseConfig {
    return {
        useCaretForExponentiation: !!options.useCaretForExponentiation,
        useParenForTensors: !!options.useParenForTensors
    };
}

class EigenmathErrorHandler implements ScriptErrorHandler {
    errors: Error[] = [];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    error(inbuf: string, start: number, end: number, err: unknown, $: ScriptVars): void {
        this.errors.push(new Error(`${err}`));
    }
}

export interface RenderConfig {
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
    parse(sourceText: string, options?: Partial<ParseConfig>): { trees: U[], errors: Error[] };
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
    /**
     * Based on Algebrite, which was derived from Eigenmath.
     */
    Native = 1,
    Eigenmath = 2
}

export interface EngineConfig {
    useGeometricAlgebra: boolean;
}

function engine_kind_from_eval_config(config: Partial<EngineConfig>): EngineKind {
    if (config.useGeometricAlgebra) {
        return EngineKind.Native;
    }
    else {
        return EngineKind.Eigenmath;
    }
}

class NativeExprEngine implements ExprEngine {
    $: ExtensionEnv;
    constructor() {
        this.$ = create_env();
        init_env(this.$, {});
    }
    parse(sourceText: string, options: Partial<ParseConfig> = {}): { trees: U[]; errors: Error[]; } {
        return parse_native_script("", sourceText, native_parse_config(options));
    }
    getBinding(sym: Sym): U {
        return this.$.getBinding(sym.printname);
    }
    evaluate(expr: U): U {
        const { value } = transform_tree(expr, {}, this.$);
        return value;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    renderAsString(expr: U, config: Partial<RenderConfig> = {}): string {
        this.$.pushDirective(Directive.useCaretForExponentiation, !!config.useCaretForExponentiation);
        this.$.pushDirective(Directive.useParenForTensors, !!config.useParenForTensors);
        try {
            return render_as_infix(expr, this.$);
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
        this.$.setBinding(sym.printname, binding);
        this.$.setUsrFunc(sym.printname, usrfunc);
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
    parse(sourceText: string, options: Partial<ParseConfig> = {}): { trees: U[]; errors: Error[]; } {
        const emErrorHandler = new EigenmathErrorHandler();
        const trees: U[] = parse_eigenmath_script(sourceText, eigenmath_parse_config(options), emErrorHandler);
        return { trees, errors: emErrorHandler.errors };
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getBinding(sym: Sym): U {
        return get_binding(sym, this.$);
    }
    evaluate(expr: U): U {
        return evaluate_expression(expr, this.$);
    }
    renderAsString(expr: U, config: Partial<RenderConfig> = {}): string {
        return to_infix(expr, eigenmath_infix_config(config));
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
                return symbol(LAST);
            }
            case Concept.TTY: {
                return symbol(TTY);
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

export function create_engine(config: Partial<EngineConfig> = {}): ExprEngine {
    const engineKind = engine_kind_from_eval_config(config);
    switch (engineKind) {
        case EngineKind.Native: {
            return new NativeExprEngine();
        }
        case EngineKind.Eigenmath: {
            return new EigenmathExprEngine();
        }
        default: {
            throw new Error(`Unexpected options.syntaxKind`);
        }
    }
}

export interface ScriptHandler {
    begin($: ExprEngine): void;
    output(value: U, input: U, $: ExprEngine): void;
    text(text: string): void;
    end($: ExprEngine): void;
}

class MyExprEngineListener implements ExprEngineListener {
    constructor(private readonly handler: ScriptHandler) {

    }
    output(output: string): void {
        this.handler.text(output);
    }
}

export function run_script(engine: ExprEngine, inputs: U[], handler: ScriptHandler): void {
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

export class PrintScriptHandler implements ScriptHandler {
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

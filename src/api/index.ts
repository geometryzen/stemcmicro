import { Sym } from 'math-expression-atoms';
import { is_nil, nil, U } from 'math-expression-tree';
import { EigenmathParseConfig, EmitContext, evaluate_expression, get_binding, InfixOptions, init, initscript, iszero, LAST, parseScript, print_result_and_input, ScriptErrorHandler, ScriptOutputListener, ScriptVars, set_symbol, symbol, to_infix, TTY } from '../eigenmath';
import { create_env } from '../env/env';
import { Directive, ExtensionEnv } from '../env/ExtensionEnv';
import { ParseOptions, parse_script } from '../parser/parser';
import { render_as_infix } from '../print/render_as_infix';
import { transform_tree } from '../runtime/execute';
import { RESERVED_KEYWORD_LAST } from '../runtime/ns_script';
import { env_term, init_env } from '../runtime/script_engine';

export interface ParseConfig {
    useCaretForExponentiation: boolean;
    useGeometricAlgebra: boolean;
    useParenForTensors: boolean;
}

function native_parse_config(options: ParseConfig): ParseOptions {
    return {
        useCaretForExponentiation: options.useCaretForExponentiation,
        useParenForTensors: options.useParenForTensors
    };
}

function eigenmath_parse_config(options: ParseConfig): EigenmathParseConfig {
    return {
        useCaretForExponentiation: options.useCaretForExponentiation,
        useParenForTensors: options.useParenForTensors
    };
}

class EigenmathErrorHandler implements ScriptErrorHandler {
    errors: Error[] = [];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    error(inbuf: string, start: number, end: number, err: unknown, $: ScriptVars): void {
        this.errors.push(new Error(`${err}`));
    }
}

export function parse(sourceText: string, options: ParseConfig): { trees: U[], errors: Error[] } {
    const engineKind = engine_kind_from_parse_config(options);
    switch (engineKind) {
        case EngineKind.Native: {
            const { trees, errors } = parse_script("", sourceText, native_parse_config(options));
            return { trees, errors };
        }
        case EngineKind.Eigenmath: {
            const errorHandler = new EigenmathErrorHandler();
            const trees: U[] = parseScript(sourceText, eigenmath_parse_config(options), errorHandler);
            return { trees, errors: errorHandler.errors };
        }
        default: {
            throw new Error(`Unexpected options.syntaxKind`);
        }
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
    evaluate(expr: U): U;
    getBinding(sym: Sym): U;
    release(): void;
    renderAsString(expr: U, config: RenderConfig): string;
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

function engine_kind_from_parse_config(config: ParseConfig): EngineKind {
    if (config.useGeometricAlgebra) {
        return EngineKind.Native;
    }
    else {
        return EngineKind.Eigenmath;
    }
}

export interface EvalConfig {
    useGeometricAlgebra: boolean;
}

function engine_kind_from_eval_config(config: EvalConfig): EngineKind {
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
    getBinding(sym: Sym): U {
        return this.$.getBinding(sym.printname);
    }
    evaluate(expr: U): U {
        const { value } = transform_tree(expr, {}, this.$);
        return value;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    renderAsString(expr: U, config: RenderConfig): string {
        this.$.pushDirective(Directive.useCaretForExponentiation, config.useCaretForExponentiation);
        this.$.pushDirective(Directive.useParenForTensors, config.useParenForTensors);
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
        }
        throw new Error(`symbol(${concept}) Method not implemented.`);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    addListener(listener: ExprEngineListener): void {
        // throw new Error('Method not implemented.');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    removeListener(listener: ExprEngineListener): void {
        // throw new Error('Method not implemented.');
    }
}

function eigenmath_infix_config(config: RenderConfig): InfixOptions {
    const options: InfixOptions = {
        useCaretForExponentiation: config.useCaretForExponentiation,
        useParenForTensors: config.useParenForTensors
    };
    return options;
}

class EigenmathOutputListener implements ScriptOutputListener {
    constructor(public readonly inner: ExprEngineListener) {

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getBinding(sym: Sym): U {
        return get_binding(sym, this.$);
    }
    evaluate(expr: U): U {
        return evaluate_expression(expr, this.$);
    }
    renderAsString(expr: U, config: RenderConfig): string {
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
                throw new Error('Method not implemented.');
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

export function create_engine(config: EvalConfig): ExprEngine {
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
    end($: ExprEngine): void;
}

export function run_script(inputs: U[], config: EvalConfig, handler: ScriptHandler): void {
    const engine: ExprEngine = create_engine(config);
    try {
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
        }
    }
    finally {
        engine.release();
    }
}

class PrintScriptListener implements ExprEngineListener {
    constructor(private readonly outer: PrintScriptHandler) {

    }
    output(output: string): void {
        this.outer.outputs.push(output);
    }
}

export class PrintScriptHandler implements ScriptHandler {
    outputs: string[] = [];
    listener: PrintScriptListener;
    constructor(readonly stdout: HTMLElement) {
        this.listener = new PrintScriptListener(this);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    begin($: ExprEngine): void {
        this.stdout.innerHTML = "";
        $.addListener(this.listener);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    end($: ExprEngine): void {
        $.removeListener(this.listener);
        for (const output of this.outputs) {
            this.stdout.innerHTML += output;
        }
    }
    output(value: U, input: U, $: ExprEngine): void {
        const ec: EmitContext = {
            useImaginaryI: true,//isimaginaryunit(get_binding(symbol(I_LOWER), $)),
            useImaginaryJ: false,//isimaginaryunit(get_binding(symbol(J_LOWER), $))
        };
        print_result_and_input(value, input, should_render_svg($), ec, [this.listener]);
    }
}

function should_render_svg($: ExprEngine): boolean {
    const sym = $.symbol(Concept.TTY);
    const tty = $.getBinding(sym);
    if (tty.equals(sym) || iszero(tty)) {
        return true;
    }
    else {
        return false;
    }
}
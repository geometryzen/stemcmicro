import { Sym } from 'math-expression-atoms';
import { is_nil, nil, U } from 'math-expression-tree';
import { EigenmathParseConfig, evaluate_expression, InfixOptions, init, initscript, LAST, parseScript, ScriptErrorHandler, ScriptVars, set_symbol, symbol, to_infix } from '../eigenmath';
import { create_env } from '../env/env';
import { Directive, ExtensionEnv } from '../env/ExtensionEnv';
import { ParseOptions, parse_script } from '../parser/parser';
import { render_as_infix } from '../print/render_as_infix';
import { transform_tree } from '../runtime/execute';
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
    Last = 1
}

export interface ExprEngine {
    evaluate(expr: U): U;
    renderAsString(expr: U, config: RenderConfig): string;
    release(): void;
    setSymbol(sym: Sym, binding: U, usrfunc: U): void;
    symbol(concept: Concept): Sym;
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
        throw new Error('Method not implemented.');
    }
    symbol(concept: Concept): Sym {
        switch (concept) {
            case Concept.Last: {
                break;
            }
        }
        throw new Error('Method not implemented.');
    }
}

function eigenmath_infix_config(config: RenderConfig): InfixOptions {
    const options: InfixOptions = {
        useCaretForExponentiation: config.useCaretForExponentiation,
        useParenForTensors: config.useParenForTensors
    };
    return options;
}

class EigenmathExprEngine implements ExprEngine {
    $: ScriptVars = new ScriptVars();
    constructor() {
        init(this.$);
        initscript(this.$);
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
            default: {
                throw new Error('Method not implemented.');
            }
        }
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

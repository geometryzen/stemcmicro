import { U } from 'math-expression-tree';
import { evaluate_expression, InfixOptions, ParseConfig as EigenmathParseConfig, parseScript, ScriptErrorHandler, ScriptVars, to_infix } from '../eigenmath';
import { create_env } from '../env/env';
import { Directive, ExtensionEnv } from '../env/ExtensionEnv';
import { ParseOptions, parse_script } from '../parser/parser';
import { render_as_infix } from '../print/render_as_infix';
import { transform_tree } from '../runtime/execute';
import { env_term, init_env } from '../runtime/script_engine';

export enum SyntaxKind {
    /**
     * Based on Algebrite, which was derived from Eigenmath.
     */
    Native = 1,
    Eigenmath = 2
}

export interface ParseConfig {
    syntaxKind: SyntaxKind,
    useCaretForExponentiation: boolean;
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
    switch (options.syntaxKind) {
        case SyntaxKind.Native: {
            const { trees, errors } = parse_script("", sourceText, native_parse_config(options));
            return { trees, errors };
        }
        case SyntaxKind.Eigenmath: {
            const errorHandler = new EigenmathErrorHandler();
            const trees: U[] = parseScript(sourceText, eigenmath_parse_config(options), errorHandler);
            return { trees, errors: errorHandler.errors };
        }
        default: {
            throw new Error(`Unexpected options.syntaxKind`);
        }
    }
}

export interface InfixConfig {
    useCaretForExponentiation: boolean;
    useParenForTensors: boolean;
}

export interface ExprEngine {
    evaluate(expr: U): U;
    renderAsInfix(expr: U, config: InfixConfig): string;
    release(): void;
}

export enum EngineKind {
    /**
     * Based on Algebrite, which was derived from Eigenmath.
     */
    Native = 1,
    Eigenmath = 2
}

export interface EvalConfig {
    engineKind: EngineKind;
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
    renderAsInfix(expr: U, config: InfixConfig): string {
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
}

function eigenmath_infix_config(config: InfixConfig): InfixOptions {
    const options: InfixOptions = {
        useCaretForExponentiation: config.useCaretForExponentiation,
        useParenForTensors: config.useParenForTensors
    };
    return options;
}

class EigenmathExprEngine implements ExprEngine {
    $: ScriptVars = new ScriptVars();
    evaluate(expr: U): U {
        return evaluate_expression(expr, this.$);
    }
    renderAsInfix(expr: U, config: InfixConfig): string {
        return to_infix(expr, eigenmath_infix_config(config));
    }
    release(): void {
        // Do nothing (yet).
    }
}

export function create_engine(config: EvalConfig): ExprEngine {
    switch (config.engineKind) {
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

// import assert from 'assert';
import { create_sym } from "@stemcmicro/atoms";
import { EmParseOptions, em_parse } from "@stemcmicro/em-parse";
import { create_engine } from "@stemcmicro/engine";
import { hilbert } from "@stemcmicro/hilbert";
import { js_parse } from "@stemcmicro/js-parse";
import { py_parse } from "@stemcmicro/py-parse";
import { U } from "@stemcmicro/tree";

export interface MungeConfig {
    allowUndeclaredVars: "Err" | "Nil";
    language: "eigenmath" | "javascript" | "python";
    traceLevel?: 0 | 1;
    useCaretForExponentiation?: boolean;
    useDerivativeShorthandLowerD?: boolean;
    useIntegersForPredicates?: boolean;
    useParenForTensors?: boolean;
}

/**
 * Parse and evaluate the sourceText using the specified options.
 */
export function munge(sourceText: string | string[], options: Partial<MungeConfig> = {}): U {
    const { trees, errors } = parse(sourceText, options);
    if (errors.length === 0) {
        const engine = create_engine({
            allowUndeclaredVars: options.allowUndeclaredVars,
            traceLevel: options.traceLevel,
            useCaretForExponentiation: options.useCaretForExponentiation,
            useDerivativeShorthandLowerD: options.useDerivativeShorthandLowerD,
            useIntegersForPredicates: options.useIntegersForPredicates
        });
        engine.defineFunction(create_sym("hilbert"), hilbert);
        for (let i = 0; i < trees.length; i++) {
            const value = engine.valueOf(trees[i]);
            try {
                if (i === trees.length - 1) {
                    value.addRef();
                    return value;
                }
            } finally {
                value.release();
            }
        }
        return engine.valueOf(trees[trees.length - 1]);
    } else {
        throw errors[0];
    }
}

export function parse(sourceText: string | string[], options: Partial<MungeConfig>): { trees: U[]; errors: Error[] } {
    const s = Array.isArray(sourceText) ? sourceText.join("\n") : sourceText;
    switch (options.language) {
        case "eigenmath": {
            return em_parse(s, em_parse_options(options));
        }
        case "javascript": {
            return js_parse(s);
        }
        case "python": {
            return py_parse(s);
        }
        default: {
            return em_parse(s, em_parse_options(options));
        }
    }
}

function em_parse_options(options: Partial<MungeConfig>): EmParseOptions {
    const retval: EmParseOptions = {
        catchExceptions: false,
        explicitAssocAdd: false,
        explicitAssocExt: false,
        explicitAssocMul: false,
        useCaretForExponentiation: options.useCaretForExponentiation,
        useParenForTensors: options.useParenForTensors
    };
    return retval;
}

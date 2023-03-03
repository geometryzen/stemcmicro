import { BriteParseOptions, brite_parse } from "../brite/parse_script";
import { U } from "../tree/tree";
import type { TsParseOptions } from "../typescript/ts_parse";

export enum ScriptKind {
    BRITE = 1,
    JS = 2,
    TS = 4,
}

export interface ParseOptions {
    scriptKind?: ScriptKind;
    /**
     * Determines whether the caret symbol '^' is used to denote exponentiation.
     * The alternative is to use '**', which frees the caret symbol to denote the outer product.
     */
    useCaretForExponentiation?: boolean;
    /**
     * Determines whether the parser makes associativity explicit or implicit in additive expressions.
     */
    explicitAssocAdd?: boolean;
    /**
     * Determines whether the parser makes associativity explicit or implicit in multiplicative expressions.
     */
    explicitAssocMul?: boolean;
}

export function parse_script(fileName: string, sourceText: string, options?: ParseOptions): { trees: U[], errors: Error[] } {
    const scriptKind = script_kind_from_options(options);
    switch (scriptKind) {
        case ScriptKind.BRITE: {
            return brite_parse(fileName, sourceText, brite_parse_options(options));
        }
        /*
        case ScriptKind.JS:
        case ScriptKind.TS: {
            const tree = ts_parse(fileName, sourceText, ts_parse_options(options));
            return { trees: [tree], errors: [] };
        }
        */
        default: {
            throw new Error(`options.scriptKind ${scriptKind} must be either BRITE or Js, or TS.`);
        }
    }
}

function brite_parse_options(options?: ParseOptions): BriteParseOptions {
    if (options) {
        return {
            explicitAssocAdd: options.explicitAssocAdd,
            explicitAssocMul: options.explicitAssocMul,
            useCaretForExponentiation: options.useCaretForExponentiation
        };
    }
    else {
        return {};
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function ts_parse_options(options?: ParseOptions): TsParseOptions {
    if (options) {
        if (options.useCaretForExponentiation) {
            throw new Error("useCaretForExponentiation is not supported by the TypeScript parser");
        }
        return {
            explicitAssocAdd: options.explicitAssocAdd,
            explicitAssocMul: options.explicitAssocMul,
        };
    }
    else {
        return {};
    }
}

function script_kind_from_options(options?: ParseOptions): ScriptKind {
    if (options) {
        if (options.scriptKind) {
            return options.scriptKind;
        }
        else {
            return ScriptKind.BRITE;
        }
    }
    else {
        return ScriptKind.BRITE;
    }
}
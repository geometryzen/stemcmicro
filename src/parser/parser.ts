import { EigenmathParseOptions, eigenmath_parse } from "../brite/parse_script";
import { MATH_ADD, MATH_MUL, MATH_POW } from "../runtime/ns_math";
import { SchemeParseOptions } from "../scheme/SchemeParseOptions";
import { scheme_parse } from "../scheme/scheme_parse";
import { U } from "../tree/tree";
import { TsParseOptions } from "../typescript/ts_parse";
import { TyphonParseOptions, typhon_parse } from "../typhon/typhon_parse";

export enum ScriptKind {
    Eigenmath = 1,
    Python = 2,
    Scheme = 3,
}

export function human_readable_script_kind(scriptKind: ScriptKind): string {
    switch (scriptKind) {
        case ScriptKind.Eigenmath: return "Eigenmath";
        case ScriptKind.Python: return "Python";
        case ScriptKind.Scheme: return "Scheme";
    }
}

export const scriptKinds: ScriptKind[] = [ScriptKind.Eigenmath, ScriptKind.Python, ScriptKind.Scheme];

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
        case ScriptKind.Eigenmath: {
            return eigenmath_parse(fileName, sourceText, eigenmath_parse_options(options));
        }
        case ScriptKind.Scheme: {
            return scheme_parse(fileName, sourceText, scheme_parse_options(options));
        }
        case ScriptKind.Python: {
            return typhon_parse(fileName, sourceText, typhon_parse_options(options));
        }
        /*
        case ScriptKind.JS:
        case ScriptKind.TS: {
            const tree = ts_parse(fileName, sourceText, ts_parse_options(options));
            return { trees: [tree], errors: [] };
        }
        */
        default: {
            throw new Error(`options.scriptKind ${scriptKind} must be one of ${JSON.stringify(scriptKinds.map(human_readable_script_kind).sort())}.`);
        }
    }
}

function eigenmath_parse_options(options?: ParseOptions): EigenmathParseOptions {
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

function scheme_parse_options(options?: ParseOptions): SchemeParseOptions {
    if (options) {
        if (options.useCaretForExponentiation) {
            throw new Error("useCaretForExponentiation is not supported by the Scheme parser");
        }
        return {
            lexicon: {
                '+': MATH_ADD,
                '*': MATH_MUL,
                'expt': MATH_POW
            },
            explicitAssocAdd: options.explicitAssocAdd,
            explicitAssocMul: options.explicitAssocMul,
        };
    }
    else {
        return scheme_parse_options({});
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

function typhon_parse_options(options?: ParseOptions): TyphonParseOptions {
    if (options) {
        if (options.useCaretForExponentiation) {
            throw new Error("useCaretForExponentiation is not supported by the Python parser");
        }
        return {
            explicitAssocAdd: options.explicitAssocAdd,
            explicitAssocMul: options.explicitAssocMul
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
            return ScriptKind.Eigenmath;
        }
    }
    else {
        return ScriptKind.Eigenmath;
    }
}
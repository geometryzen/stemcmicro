import { EigenmathParseOptions, eigenmath_parse } from "../brite/eigenmath_parse";
import { U } from "../tree/tree";
import { TsParseOptions } from "../typescript/ts_parse";
import { PythonParseOptions } from "../typhon/PythonParseOptions";
import { python_parse } from "../typhon/python_parse";

export enum SyntaxKind {
    /**
     * Based on Algebrite, which was derived from Eigenmath.
     */
    Native = 1,
    /**
     * Python Programming Language.
     */
    Python = 2,
}

export function human_readable_syntax_kind(syntaxKind: SyntaxKind): string {
    switch (syntaxKind) {
        case SyntaxKind.Native: return "Native";
        case SyntaxKind.Python: return "Python";
    }
}

export const syntaxKinds: SyntaxKind[] = [SyntaxKind.Native, SyntaxKind.Python];

export interface ParseOptions {
    catchExceptions?: boolean,
    syntaxKind?: SyntaxKind;
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

export function parse_expr(sourceText: string, options?: ParseOptions): U {
    const { trees, errors } = parse_script("", sourceText, options);
    if (errors.length == 0) {
        if (trees.length > 0) {
            return trees[0];
        }
        else {
            throw new Error();
        }
    }
    else {
        throw errors[1];
    }
}

export function parse_script(fileName: string, sourceText: string, options?: ParseOptions): { trees: U[], errors: Error[] } {
    const syntaxKind = script_kind_from_options(options);
    switch (syntaxKind) {
        case SyntaxKind.Native: {
            return eigenmath_parse(fileName, sourceText, eigenmath_parse_options(options));
        }
        case SyntaxKind.Python: {
            return python_parse(fileName, sourceText, typhon_parse_options(options));
        }
        /*
        case ScriptKind.JS:
        case ScriptKind.TS: {
            const tree = ts_parse(fileName, sourceText, ts_parse_options(options));
            return { trees: [tree], errors: [] };
        }
        */
        default: {
            throw new Error(`options.syntaxKind ${syntaxKind} must be one of ${JSON.stringify(syntaxKinds.map(human_readable_syntax_kind).sort())}.`);
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

function typhon_parse_options(options?: ParseOptions): PythonParseOptions {
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

function script_kind_from_options(options?: ParseOptions): SyntaxKind {
    if (options) {
        if (options.syntaxKind) {
            return options.syntaxKind;
        }
        else {
            return SyntaxKind.Native;
        }
    }
    else {
        return SyntaxKind.Native;
    }
}
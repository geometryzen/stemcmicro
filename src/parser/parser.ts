import { EigenmathErrorHandler } from "../api";
import { AlgebriteParseOptions, algebrite_parse } from "../algebrite/algebrite_parse";
import { ClojureScriptParseOptions } from "../clojurescript/parser/ClojureScriptParseOptions";
import { clojurescript_parse } from "../clojurescript/parser/clojurescript_parse";
import { EigenmathParseConfig, parse_eigenmath_script, ScriptVars } from "../eigenmath";
import { U } from "../tree/tree";
import { PythonScriptParseOptions } from "../pythonscript/PythonScriptParseOptions";
import { pythonscript_parse } from "../pythonscript/pythonscript_parse";

export enum SyntaxKind {
    /**
     * Algebrite Scripting Language.
     */
    Algebrite = 1,
    /**
     * ClojureScript Programming Language.
     */
    ClojureScript = 2,
    /**
     * Eigenmath Scripting Language.
     */
    Eigenmath = 3,
    /**
     * Python Programming Language.
     */
    PythonScript = 4,
}

export function human_readable_syntax_kind(syntaxKind: SyntaxKind): string {
    if (syntaxKind) {
        switch (syntaxKind) {
            case SyntaxKind.Algebrite: return "Algebrite";
            case SyntaxKind.ClojureScript: return "ClojureScript";
            case SyntaxKind.Eigenmath: return "Eigenmath";
            case SyntaxKind.PythonScript: return "PythonScript";
        }
    }
    else {
        throw new Error("syntaxKind MUST be specified.");
    }
}

export const syntaxKinds: SyntaxKind[] = [SyntaxKind.Algebrite, SyntaxKind.ClojureScript, SyntaxKind.Eigenmath, SyntaxKind.PythonScript];

export interface ParseOptions {
    catchExceptions?: boolean,
    syntaxKind?: SyntaxKind;
    /**
     * Determines whether the caret symbol '^' is used to denote exponentiation.
     * The alternative is to use '**', which frees the caret symbol to denote the outer product.
     */
    useCaretForExponentiation?: boolean;
    useParenForTensors?: boolean;
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
    const { trees, errors } = delegate_parse_script(sourceText, options);
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

export function delegate_parse_script(sourceText: string, options?: ParseOptions): { trees: U[], errors: Error[] } {
    const syntaxKind = script_kind_from_options(options);
    switch (syntaxKind) {
        case SyntaxKind.Algebrite: {
            return algebrite_parse(sourceText, algebrite_parse_options(options));
        }
        case SyntaxKind.ClojureScript: {
            return clojurescript_parse(sourceText, clojurescript_parse_options(options));
        }
        case SyntaxKind.Eigenmath: {
            const emErrorHandler = new EigenmathErrorHandler();
            const scriptVars = new ScriptVars();
            scriptVars.init();
            const trees: U[] = parse_eigenmath_script(sourceText, eigenmath_parse_options(options), emErrorHandler, scriptVars);
            return { trees, errors: emErrorHandler.errors };
        }
        case SyntaxKind.PythonScript: {
            return pythonscript_parse(sourceText, python_parse_options(options));
        }
        default: {
            throw new Error(`options.syntaxKind ${syntaxKind} must be one of ${JSON.stringify(syntaxKinds.map(human_readable_syntax_kind).sort())}.`);
        }
    }
}

function algebrite_parse_options(options?: ParseOptions): AlgebriteParseOptions {
    if (options) {
        return {
            explicitAssocAdd: options.explicitAssocAdd,
            explicitAssocMul: options.explicitAssocMul,
            useCaretForExponentiation: options.useCaretForExponentiation,
            useParenForTensors: options.useParenForTensors
        };
    }
    else {
        return {};
    }
}

function clojurescript_parse_options(options?: ParseOptions): ClojureScriptParseOptions {
    if (options) {
        return {
            explicitAssocAdd: options.explicitAssocAdd,
            explicitAssocMul: options.explicitAssocMul,
            // useCaretForExponentiation: options.useCaretForExponentiation,
            // useParenForTensors: options.useParenForTensors,
            lexicon: {}
        };
    }
    else {
        return {
            lexicon: {}
        };
    }
}

function eigenmath_parse_options(options?: ParseOptions): EigenmathParseConfig {
    if (options) {
        return {
            useCaretForExponentiation: !!options.useCaretForExponentiation,
            useParenForTensors: !!options.useParenForTensors
        };
    }
    else {
        return {
            useCaretForExponentiation: true,
            useParenForTensors: true
        };
    }
}

function python_parse_options(options?: ParseOptions): PythonScriptParseOptions {
    if (options) {
        if (options.useCaretForExponentiation) {
            throw new Error("useCaretForExponentiation is not supported by the Python parser.");
        }
        if (options.useParenForTensors) {
            throw new Error("useParenForTensors is not supported by the Python parser.");
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
            return SyntaxKind.Algebrite;
        }
    }
    else {
        return SyntaxKind.Algebrite;
    }
}

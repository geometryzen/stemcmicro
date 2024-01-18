import { Dictionary, is_dictionary } from "../../clojurescript/atoms/Dictionary";
import { Extension, ExtensionEnv, FEATURE, TFLAGS, TFLAG_HALT, TFLAG_NONE } from "../../env/ExtensionEnv";
import { print_str } from "../../print/print";
import { defs, PrintMode, PRINTMODE_SEXPR } from "../../runtime/defs";
import { cons, Cons, U } from "../../tree/tree";
import { ExtensionOperatorBuilder } from "../helpers/ExtensionOperatorBuilder";

class DictionaryExtension implements Extension<Dictionary> {
    // Create an exemplar of the atom we control to discover it's name for hashing purposes.
    readonly #hash: string = new Dictionary([]).name;
    readonly dependencies: FEATURE[] = ['Map'];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor($: ExtensionEnv) {
        // Nothing to see here.
    }
    get key() {
        return this.#hash;
    }
    get hash() {
        return this.#hash;
    }
    get name() {
        return 'DictionaryExtension';
    }
    evaluate(dictionary: Dictionary, argList: Cons): [TFLAGS, U] {
        return this.transform(cons(dictionary, argList));
    }
    transform(expr: U): [TFLAGS, U] {
        // We actually need to dig into the entries...
        return [is_dictionary(expr) ? TFLAG_HALT : TFLAG_NONE, expr];
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    valueOf(dictionary: Dictionary, $: ExtensionEnv): U {
        throw new Error("DictionaryExtension.valueOf() method not implemented.");
    }
    isKind(x: U): x is Dictionary {
        return is_dictionary(x);
    }
    subst(expr: Dictionary, oldExpr: U, newExpr: U): U {
        if (this.isKind(oldExpr)) {
            if (expr.equals(oldExpr)) {
                return newExpr;
            }
        }
        return expr;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    toInfixString(dictionary: Dictionary, $: ExtensionEnv): string {
        throw new Error("DictionaryExtension.toInfixString() method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    toLatexString(dictionary: Dictionary, $: ExtensionEnv): string {
        return print_dictionary_latex(dictionary, $);
    }
    toListString(dictionary: Dictionary, $: ExtensionEnv): string {
        // While the following implementation requires refactoring due to some technical weaknesses,
        // the basic idea is good. The function to print the dictionary should be owned by this extension.
        const printMode: PrintMode = defs.printMode;
        defs.setPrintMode(PRINTMODE_SEXPR);
        try {
            return print_dictionary(dictionary, $);
        }
        finally {
            defs.setPrintMode(printMode);
        }

        throw new Error("DictionaryExtension.toListString() method not implemented.");
    }
}

/**
 * The dictionary Extension a.k.a Map extension.
 */
export const map_extension = new ExtensionOperatorBuilder(function ($: ExtensionEnv) {
    return new DictionaryExtension($);
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function print_dictionary(dictionary: Dictionary, $: ExtensionEnv): string {
    let str = '';
    str += print_str('{');
    try {
        const elements: U[] = dictionary.elements;
        const n = elements.length / 2;
        const entries: string[] = [];
        for (let i = 0; i < n; i++) {
            const key = elements[2 * i];
            const value = elements[2 * i + 1];
            const keyStr = $.toSExprString(key);
            const valStr = $.toSExprString(value);
            entries.push(`${keyStr} ${valStr}`);
        }
        str += entries.join(' ');
    }
    finally {
        str += print_str('}');
    }
    return str;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function print_dictionary_latex(dictionary: Dictionary, $: ExtensionEnv): string {
    let str = '';

    str += '\\begin{lstlisting}[language=python]';

    // https://tex.stackexchange.com/questions/530880/how-to-represent-a-python-print-like-dictionary-in-latex-text

    str += ' \\end{lstlisting}';

    return str;
}

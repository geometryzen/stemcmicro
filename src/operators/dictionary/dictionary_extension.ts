import { is_map, Map } from "../../clojurescript/atoms/Map";
import { Extension, ExtensionEnv, FEATURE, TFLAGS, TFLAG_HALT, TFLAG_NONE } from "../../env/ExtensionEnv";
import { hash_for_atom } from "../../hashing/hash_info";
import { print_str } from "../../print/print";
import { defs, PrintMode, PRINTMODE_SEXPR } from "../../runtime/defs";
import { cons, Cons, U } from "../../tree/tree";
import { ExtensionOperatorBuilder } from "../helpers/ExtensionOperatorBuilder";

function verify_map(x: Map): Map | never {
    if (is_map(x)) {
        return x;
    }
    else {
        throw new Error();
    }
}

class DictionaryExtension implements Extension<Map> {
    // Create an exemplar of the atom we control to discover it's name for hashing purposes.
    readonly #atom: Map = verify_map(new Map([]));
    readonly #hash: string = hash_for_atom(verify_map(this.#atom));
    readonly dependencies: FEATURE[] = ['Map'];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor($: ExtensionEnv) {
        // Nothing to see here.
    }
    iscons(): false {
        return false;
    }
    operator(): never {
        throw new Error();
    }
    get hash() {
        return this.#hash;
    }
    get name() {
        return 'DictionaryExtension';
    }
    evaluate(dictionary: Map, argList: Cons): [TFLAGS, U] {
        return this.transform(cons(dictionary, argList));
    }
    transform(expr: U): [TFLAGS, U] {
        // We actually need to dig into the entries...
        return [is_map(expr) ? TFLAG_HALT : TFLAG_NONE, expr];
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    valueOf(dictionary: Map, $: ExtensionEnv): U {
        throw new Error("DictionaryExtension.valueOf() method not implemented.");
    }
    isKind(x: U): x is Map {
        return is_map(x);
    }
    subst(expr: Map, oldExpr: U, newExpr: U): U {
        if (this.isKind(oldExpr)) {
            if (expr.equals(oldExpr)) {
                return newExpr;
            }
        }
        return expr;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    toInfixString(dictionary: Map, $: ExtensionEnv): string {
        throw new Error("DictionaryExtension.toInfixString() method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    toLatexString(dictionary: Map, $: ExtensionEnv): string {
        return print_dictionary_latex(dictionary, $);
    }
    toListString(dictionary: Map, $: ExtensionEnv): string {
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
export function print_dictionary(dictionary: Map, $: ExtensionEnv): string {
    let str = '';
    str += print_str('{');
    try {
        const entries: [key: U, value: U][] = dictionary.entries;
        const n = entries.length;
        const pairs: string[] = [];
        for (let i = 0; i < n; i++) {
            const key = entries[i][0];
            const value = entries[i][1];
            const keyStr = $.toSExprString(key);
            const valStr = $.toSExprString(value);
            pairs.push(`${keyStr} ${valStr}`);
        }
        str += pairs.join(' ');
    }
    finally {
        str += print_str('}');
    }
    return str;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function print_dictionary_latex(dictionary: Map, $: ExtensionEnv): string {
    let str = '';

    str += '\\begin{lstlisting}[language=python]';

    // https://tex.stackexchange.com/questions/530880/how-to-represent-a-python-print-like-dictionary-in-latex-text

    str += ' \\end{lstlisting}';

    return str;
}

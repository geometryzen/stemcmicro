import { is_map, Map, Sym } from "math-expression-atoms";
import { AtomHandler, ExprContext } from "math-expression-context";
import { cons, Cons, U } from "math-expression-tree";
import { Extension, ExtensionBuilder, ExtensionEnv, FEATURE, TFLAGS, TFLAG_HALT, TFLAG_NONE } from "../../env/ExtensionEnv";
import { hash_for_atom } from "../../hashing/hash_info";
import { print_str } from "../../print/print";
import { defs, PrintMode, PRINTMODE_SEXPR } from "../../runtime/defs";

function verify_map(x: Map): Map | never {
    if (is_map(x)) {
        return x;
    }
    else {
        throw new Error();
    }
}

class DictionaryExtension implements Extension<Map>, AtomHandler<Map> {
    // Create an exemplar of the atom we control to discover it's name for hashing purposes.
    readonly #atom: Map = verify_map(new Map([]));
    readonly #hash: string = hash_for_atom(verify_map(this.#atom));
    readonly dependencies: FEATURE[] = ['Map'];
    constructor() {
        // Nothing to see here.
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    test(atom: Map, opr: Sym, env: ExprContext): boolean {
        return false;
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
    }
}


class Builder implements ExtensionBuilder<U> {
    create(): Extension<U> {
        return new DictionaryExtension();
    }
}

export const map_extension_builder = new Builder();

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

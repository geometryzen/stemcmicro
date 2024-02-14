import { Str, Sym } from "math-expression-atoms";
import { AtomHandler, ExprContext } from "math-expression-context";
import { cons, Cons, U } from "math-expression-tree";
import { Extension, Sign, TFLAGS, TFLAG_HALT, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_STR } from "../../hashing/hash_info";
import { ExtensionOperatorBuilder } from "../helpers/ExtensionOperatorBuilder";


export function strcmp(str1: string, str2: string): Sign {
    if (str1 === str2) {
        return 0;
    }
    else if (str1 > str2) {
        return 1;
    }
    else {
        return -1;
    }
}

export function is_str(arg: unknown): arg is Str {
    return arg instanceof Str;
}

class StrExtension implements Extension<Str>, AtomHandler<Str> {
    constructor() {
        // Nothing to see here.
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    test(atom: Str, opr: Sym, env: ExprContext): boolean {
        return false;
    }
    iscons(): false {
        return false;
    }
    operator(): never {
        throw new Error();
    }
    get hash(): string {
        return HASH_STR;
    }
    get name(): string {
        return 'StrExtension';
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    valueOf(str: Str, $: ExprContext): U {
        return str;
    }
    isKind(arg: U): arg is Str {
        return is_str(arg);
    }
    subst(expr: Str, oldExpr: U, newExpr: U): U {
        if (is_str(oldExpr)) {
            if (expr.equals(oldExpr)) {
                return newExpr;
            }
        }
        return expr;
    }
    toInfixString(str: Str): string {
        return JSON.stringify(str.str);
    }
    toAsciiString(str: Str): string {
        return JSON.stringify(str.str);
    }
    toHumanString(str: Str): string {
        const s = str.str;
        switch (s) {
            // Experimenting here. Better to look for use of units and "smart" render to put the number in a reasonable range.
            // https://en.wikipedia.org/wiki/Metric_prefix
            case "deci": return 'd';
            case "centi": return 'c';
            case "milli": return 'm';
            case "micro": return 'μ';
            case "nano": return 'n';
            case "pico": return 'p';
            case "femto": return 'f';
            case "atto": return 'a';
            case "deka": return 'da';
            case "hecto": return 'h';
            case "kilo": return 'k';
            case "mega": return 'M';
            case "giga": return 'G';
            case "tera": return 'T';
            case "peta": return 'P';
            case "exa": return 'E';
            default: return JSON.stringify(str.str);
        }
    }
    toLatexString(str: Str): string {
        return JSON.stringify(str.str);
    }
    toListString(str: Str): string {
        return JSON.stringify(str.str);
    }
    evaluate(str: Str, argList: Cons): [TFLAGS, U] {
        return this.transform(cons(str, argList));
    }
    transform(expr: U): [TFLAGS, U] {
        if (is_str(expr)) {
            return [TFLAG_HALT, expr];
        }
        return [TFLAG_NONE, expr];
    }
}

export const str_extension = new StrExtension();

export const str_operator_builder = new ExtensionOperatorBuilder(function () {
    return str_extension;
});
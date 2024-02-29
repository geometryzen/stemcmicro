import { create_str, create_sym, Str, Sym } from "math-expression-atoms";
import { ExprContext } from "math-expression-context";
import { Native, native_sym } from "math-expression-native";
import { cons, Cons, is_atom, nil, U } from "math-expression-tree";
import { diagnostic } from "../../diagnostics/diagnostics";
import { Diagnostics } from "../../diagnostics/messages";
import { Extension, mkbuilder, Sign, TFLAGS, TFLAG_HALT, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_STR } from "../../hashing/hash_info";

const ADD = native_sym(Native.add);

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

class StrExtension implements Extension<Str> {
    constructor() {
        // Nothing to see here.
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    test(atom: Str, opr: Sym, env: ExprContext): boolean {
        return false;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    binL(lhs: Str, opr: Sym, rhs: U, expr: ExprContext): U {
        if (opr.equalsSym(ADD)) {
            if (is_atom(rhs)) {
                if (is_str(rhs)) {
                    return create_str(lhs.str + rhs.str);
                }
            }
        }
        return nil;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    binR(rhs: Str, opr: Sym, lhs: U, expr: ExprContext): U {
        return nil;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    dispatch(target: Str, opr: Sym, argList: Cons, env: ExprContext): U {
        switch (opr.id) {
            case Native.ascii: {
                return create_str(this.toAsciiString(target));
            }
            case Native.human: {
                return create_str(this.toHumanString(target));
            }
            case Native.infix: {
                return create_str(this.toInfixString(target));
            }
            case Native.latex: {
                return create_str(this.toLatexString(target));
            }
            case Native.sexpr: {
                return create_str(this.toListString(target));
            }
        }
        return diagnostic(Diagnostics.Poperty_0_does_not_exist_on_type_1, opr, create_sym(target.type));
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
    toAsciiString(str: Str): string {
        return JSON.stringify(str.str);
    }
    toHumanString(str: Str): string {
        return JSON.stringify(str.str);
        /*
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
            default: return str.str;
        }
        */
    }
    toInfixString(str: Str): string {
        return JSON.stringify(str.str);
    }
    toLatexString(str: Str): string {
        return JSON.stringify(str.str);
    }
    toListString(str: Str): string {
        return JSON.stringify(str.str);
    }
    toString(): string {
        return this.name;
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

export const str_extension_builder = mkbuilder<Str>(StrExtension);
import { Err, is_err, Sym } from "math-expression-atoms";
import { AtomHandler } from "math-expression-context";
import { is_native, Native } from "math-expression-native";
import { cons, Cons, nil, U } from 'math-expression-tree';
import { Extension, ExtensionEnv, mkbuilder, TFLAGS, TFLAG_HALT, TFLAG_NONE } from "../../env/ExtensionEnv";
import { hash_for_atom } from "../../hashing/hash_info";

const ENGLISH_UNDEFINED = 'undefined';

/*
export function error_compare(lhs: Err, rhs: Err): Sign {
    const str1 = lhs.message;
    const str2 = rhs.message;
    if (str1 === str2) {
        return SIGN_EQ;
    }
    else if (str1 > str2) {
        return SIGN_GT;
    }
    else {
        return SIGN_LT;
    }
}
*/

export class ErrExtension implements Extension<Err>, AtomHandler<Err> {
    readonly #hash = hash_for_atom(new Err(nil));
    constructor() {
        // Nothing to see here.
    }
    get hash(): string {
        return this.#hash;
    }
    get name(): string {
        return 'ErrExtension';
    }
    test(atom: Err, opr: Sym): boolean {
        if (is_native(opr, Native.iszero)) {
            return false;
        }
        throw new Error(`${this.name}.test(${atom},${opr}) method not implemented.`);
    }
    iscons(): false {
        return false;
    }
    operator(): never {
        throw new Error();
    }
    evaluate(expr: Err, argList: Cons): [TFLAGS, U] {
        return this.transform(cons(expr, argList));
    }
    transform(expr: U): [TFLAGS, U] {
        return [expr instanceof Err ? TFLAG_HALT : TFLAG_NONE, expr];
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    valueOf(expr: Err, $: ExtensionEnv): U {
        throw new Error("ErrExtension.valueOf method not implemented.");
    }
    isKind(arg: U): arg is Err {
        return is_err(arg);
    }
    subst(expr: Err, oldExpr: U, newExpr: U): U {
        if (this.isKind(oldExpr)) {
            if (expr.equals(oldExpr)) {
                return newExpr;
            }
        }
        return expr;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    toInfixString(expr: Err, $: ExtensionEnv): string {
        return ENGLISH_UNDEFINED;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    toLatexString(expr: Err, $: ExtensionEnv): string {
        return ENGLISH_UNDEFINED;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    toListString(expr: Err, $: ExtensionEnv): string {
        return ENGLISH_UNDEFINED;
    }
}

export const err_extension_builder = mkbuilder(ErrExtension);

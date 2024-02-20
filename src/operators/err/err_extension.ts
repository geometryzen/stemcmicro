import { Err, is_err, Sym } from "math-expression-atoms";
import { ExprContext } from "math-expression-context";
import { is_native, Native, native_sym } from "math-expression-native";
import { cons, Cons, nil, U } from 'math-expression-tree';
import { Extension, ExtensionEnv, mkbuilder, TFLAGS, TFLAG_HALT, TFLAG_NONE } from "../../env/ExtensionEnv";
import { hash_for_atom } from "../../hashing/hash_info";
import { infixform } from "../../helpers/infixform";
import { ProgrammingError } from "../../programming/ProgrammingError";

const GRADE = native_sym(Native.grade);

export class ErrExtension implements Extension<Err> {
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    binL(lhs: Err, opr: Sym, rhs: U, expr: ExprContext): U {
        // Do we make a hierarchy of causes?
        return lhs;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    binR(rhs: Err, opr: Sym, lhs: U, expr: ExprContext): U {
        // Do we make a hierarchy of causes?
        return rhs;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    dispatch(target: Err, opr: Sym, argList: Cons, env: ExprContext): U {
        if (opr.equalsSym(GRADE)) {
            // We could create nested errors...
            return target;
        }
        throw new ProgrammingError(`ErrExtension.dispatch ${target} ${opr} ${argList} method not implemented.`);
    }
    iscons(): false {
        return false;
    }
    operator(): never {
        throw new ProgrammingError();
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
    toHumanString(err: Err, $: ExprContext): string {
        const cause = err.cause;
        try {
            return infixform(cause, $);
        }
        finally {
            cause.release();
        }
    }
    toInfixString(err: Err, $: ExprContext): string {
        const cause = err.cause;
        try {
            return infixform(cause, $);
        }
        finally {
            cause.release();
        }
    }
    toLatexString(err: Err, $: ExprContext): string {
        const cause = err.cause;
        try {
            return infixform(cause, $);
        }
        finally {
            cause.release();
        }
    }
    toListString(err: Err, $: ExprContext): string {
        const cause = err.cause;
        try {
            return infixform(cause, $);
        }
        finally {
            cause.release();
        }
    }
}

export const err_extension_builder = mkbuilder(ErrExtension);

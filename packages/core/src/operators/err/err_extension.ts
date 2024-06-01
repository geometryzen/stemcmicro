import { create_str, create_sym, Err, is_err, Sym } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { diagnostic, Diagnostics } from "@stemcmicro/diagnostics";
import { is_native, Native } from "@stemcmicro/native";
import { cons, Cons, nil, U } from "@stemcmicro/tree";
import { Extension, ExtensionEnv, mkbuilder, TFLAGS, TFLAG_HALT, TFLAG_NONE } from "../../env/ExtensionEnv";
import { hash_for_atom } from "../../hashing/hash_info";
import { infix } from "../../helpers/infix";
import { hook_create_err } from "../../hooks/hook_create_err";
import { ProgrammingError } from "../../programming/ProgrammingError";

export class ErrExtension implements Extension<Err> {
    readonly #hash = hash_for_atom(hook_create_err(nil));
    constructor() {
        // Nothing to see here.
    }
    get hash(): string {
        return this.#hash;
    }
    get name(): string {
        return "ErrExtension";
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
        switch (opr.id) {
            case Native.grade: {
                return target;
            }
            case Native.ascii: {
                return create_str(this.toAsciiString(target, env));
            }
            case Native.human: {
                return create_str(this.toHumanString(target, env));
            }
            case Native.infix: {
                return create_str(this.toInfixString(target, env));
            }
            case Native.latex: {
                return create_str(this.toLatexString(target, env));
            }
            case Native.sexpr: {
                return create_str(this.toListString(target, env));
            }
            case Native.simplify: {
                return target;
            }
        }
        return diagnostic(Diagnostics.Property_0_does_not_exist_on_type_1, opr, create_sym(target.type));
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
    toAsciiString(err: Err, $: ExprContext): string {
        const message = message_from_err(err);
        try {
            return infix(message, $);
        } finally {
            message.release();
        }
    }
    toHumanString(err: Err, $: ExprContext): string {
        const message = message_from_err(err);
        try {
            return infix(message, $);
        } finally {
            message.release();
        }
    }
    toInfixString(err: Err, $: ExprContext): string {
        const message = message_from_err(err);
        try {
            return infix(message, $);
        } finally {
            message.release();
        }
    }
    toLatexString(err: Err, $: ExprContext): string {
        const message = message_from_err(err);
        try {
            return infix(message, $);
        } finally {
            message.release();
        }
    }
    toListString(err: Err, $: ExprContext): string {
        const message = message_from_err(err);
        try {
            return infix(message, $);
        } finally {
            message.release();
        }
    }
}

/**
 * Extracts the appropriate message property from an Err.
 */
function message_from_err(err: Err): U {
    return err.originalMessage;
}

export const err_extension_builder = mkbuilder(ErrExtension);

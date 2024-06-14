import { create_str, create_sym, Err, Rat, Str, Sym, zero } from "@stemcmicro/atoms";
import { ExprContext, ExprHandler } from "@stemcmicro/context";
import { diagnostic, Diagnostics } from "@stemcmicro/diagnostics";
import { Native, native_sym } from "@stemcmicro/native";
import { Cons, U } from "@stemcmicro/tree";
import { iszero } from "./iszero";

const ISONE = native_sym(Native.isone);
const ISZERO = native_sym(Native.iszero);
const PI = native_sym(Native.PI);

export class RatExprHandler implements ExprHandler<Rat> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    binL(lhs: Rat, opr: Sym, rhs: U, env: ExprContext): U {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    binR(rhs: Rat, opr: Sym, lhs: U, env: ExprContext): U {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    dispatch(target: Rat, opr: Sym, argList: Cons, env: ExprContext): U {
        switch (opr.id) {
            case Native.abs: {
                return target.abs();
            }
            case Native.arg: {
                if (target.isZero()) {
                    return new Err(new Str("arg of zero (0) is undefined"));
                } else if (target.isNegative()) {
                    return PI;
                } else {
                    return zero;
                }
                break;
            }
            case Native.grade: {
                const head = argList.head;
                try {
                    if (iszero(head, env)) {
                        return target;
                    } else {
                        return zero;
                    }
                } finally {
                    head.release();
                }
            }
            case Native.ascii: {
                return create_str(target.toInfixString());
            }
            case Native.human: {
                return create_str(target.toInfixString());
            }
            case Native.infix: {
                return create_str(target.toInfixString());
            }
            case Native.latex: {
                return create_str(target.toInfixString());
            }
            case Native.sexpr: {
                return create_str(target.toListString());
            }
            case Native.simplify: {
                return target;
            }
        }
        return diagnostic(Diagnostics.Property_0_does_not_exist_on_type_1, opr, create_sym(target.type));
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    subst(expr: Rat, oldExpr: U, newExpr: U, env: Pick<ExprContext, "handlerFor">): U {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    test(atom: Rat, opr: Sym, env: ExprContext): boolean {
        if (opr.equalsSym(ISONE)) {
            return atom.isOne();
        } else if (opr.equalsSym(ISZERO)) {
            return atom.isZero();
        } else {
            throw new Error(`RatExprHandler.test(${atom},${opr}) method not implemented.`);
        }
    }
}

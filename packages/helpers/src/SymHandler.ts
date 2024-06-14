import { Sym } from "@stemcmicro/atoms";
import { ExprContext, ExprHandler } from "@stemcmicro/context";
import { Native, native_sym } from "@stemcmicro/native";
import { Cons, U } from "@stemcmicro/tree";

const ISONE = native_sym(Native.isone);
const ISZERO = native_sym(Native.iszero);

export class SymHandler implements ExprHandler<Sym> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    binL(lhs: Sym, opr: Sym, rhs: U, env: ExprContext): U {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    binR(rhs: Sym, opr: Sym, lhs: U, env: ExprContext): U {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    dispatch(expr: Sym, opr: Sym, argList: Cons, env: ExprContext): U {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    subst(expr: Sym, oldExpr: U, newExpr: U, env: Pick<ExprContext, "handlerFor">): U {
        throw new Error("Method not implemented.");
    }
    test(expr: Sym, opr: Sym): boolean {
        if (opr.equalsSym(ISONE)) {
            return false;
        } else if (opr.equalsSym(ISZERO)) {
            return false;
        } else {
            return false;
        }
    }
}

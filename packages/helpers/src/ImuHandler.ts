import { Imu, Sym } from "@stemcmicro/atoms";
import { ExprContext, ExprHandler } from "@stemcmicro/context";
import { Native, native_sym } from "@stemcmicro/native";
import { Cons, U } from "@stemcmicro/tree";

const ISONE = native_sym(Native.isone);
const ISZERO = native_sym(Native.iszero);

export class ImuHandler implements ExprHandler<Imu> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    binL(lhs: Imu, opr: Sym, rhs: U, env: ExprContext): U {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    binR(rhs: Imu, opr: Sym, lhs: U, env: ExprContext): U {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    dispatch(expr: Imu, opr: Sym, argList: Cons, env: ExprContext): U {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    subst(expr: Imu, oldExpr: U, newExpr: U, env: Pick<ExprContext, "handlerFor">): U {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    test(expr: Imu, opr: Sym, env: ExprContext): boolean {
        if (opr.equalsSym(ISONE)) {
            return false;
        } else if (opr.equalsSym(ISZERO)) {
            return false;
        }
        throw new Error(`ImuExtension.test ${opr} method not implemented.`);
    }
}

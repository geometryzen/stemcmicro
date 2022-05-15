import { CostTable } from "../../env/CostTable";
import { CHANGED, ExtensionEnv, NOFLAGS, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { MATH_MUL } from "../../runtime/ns_math";
import { one } from "../../tree/rat/Rat";
import { Cons, is_cons, makeList, U } from "../../tree/tree";
import { FunctionOperator } from "../helpers/FunctionOperator";
import { is_mul } from "./is_mul";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Mul($);
    }
}

/**
 * (* t1 t2 t3 t4 ...) => (* (* (* t1 t2) t3) t4) ...
 */
class Mul extends FunctionOperator implements Operator<Cons> {
    constructor($: ExtensionEnv) {
        super('multiply', MATH_MUL, $);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    cost(expr: U, costs: CostTable, depth: number): number {
        if (is_cons(expr)) {
            const $ = this.$;
            const childDepth = depth + 1;
            let cost = $.cost(expr.head, childDepth);
            for (const arg of expr.tail()) {
                cost += this.$.cost(arg, childDepth);
            }
            return cost;
        }
        throw new Error("Method not implemented.");
    }
    transform(expr: U): [TFLAGS, U] {
        if (is_cons(expr) && is_mul(expr) && expr.length > 3) {
            const $ = this.$;
            if ($.explicateMode) {
                let argList = expr.argList;
                let retval: U = one;
                while (is_cons(argList)) {
                    retval = makeList(MATH_MUL, retval, argList.car);
                    argList = argList.argList;
                }
                return [CHANGED, retval];
            }
        }
        return [NOFLAGS, expr];
    }
}

export const mul = new Builder();

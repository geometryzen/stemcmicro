import { CostTable } from "../../env/CostTable";
import { CHANGED, ExtensionEnv, NOFLAGS, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { is_add } from "../../runtime/helpers";
import { MATH_ADD } from "../../runtime/ns_math";
import { zero } from "../../tree/rat/Rat";
import { Cons, is_cons, makeList, U } from "../../tree/tree";
import { FunctionOperator } from "../helpers/FunctionOperator";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Add($);
    }
}

/**
 * (+ t1 t2 t3 t4 ...) => (+ (+ (+ t1 t2) t3) t4) ...
 */
class Add extends FunctionOperator implements Operator<Cons> {
    constructor($: ExtensionEnv) {
        super('add', MATH_ADD, $);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    cost(expr: Cons, costs: CostTable, depth: number): number {
        const $ = this.$;
        let cost = $.cost(expr.head, depth + 1);
        for (const arg of expr.tail()) {
            cost += this.$.cost(arg, depth + 1);
        }
        return cost;
    }
    transform(expr: U): [TFLAGS, U] {
        if (is_add(expr) && expr.length > 3) {
            const $ = this.$;
            if ($.explicateMode) {
                let argList = expr.argList;
                let retval: U = zero;
                while (is_cons(argList)) {
                    retval = makeList(MATH_ADD, retval, argList.car);
                    argList = argList.argList;
                }
                return [CHANGED, retval];
            }
        }
        return [NOFLAGS, expr];
    }
}

export const add = new Builder();

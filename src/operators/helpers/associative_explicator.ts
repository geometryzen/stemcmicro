import { CostTable } from "../../env/CostTable";
import { CHANGED, ExtensionEnv, NOFLAGS, Operator, OperatorBuilder, PHASE_EXPLICATE, TFLAGS } from "../../env/ExtensionEnv";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, makeList, U } from "../../tree/tree";
import { is_sym } from "../sym/is_sym";
import { FunctionOperator } from "./FunctionOperator";

class Builder implements OperatorBuilder<Cons> {
    constructor(private readonly name: string, private readonly opr: Sym, private readonly id: Rat) {

    }
    create($: ExtensionEnv): Operator<Cons> {
        return new Explicator(this.name, this.opr, this.id, $);
    }
}

export function is_opr(sym: Sym, expr: Cons): expr is Cons {
    const opr = expr.opr;
    if (is_sym(opr)) {
        return sym.equalsSym(opr);
    }
    else {
        return false;
    }
}

/**
 * (op t1 t2 t3 t4 ...) => (op (op (op t1 t2) t3) t4) ...
 */
class Explicator extends FunctionOperator implements Operator<Cons> {
    readonly phases = PHASE_EXPLICATE;
    /**
     * 
     * @param name 
     * @param opr 
     * @param id The identity element for the operator. e.g + is 0, * is 1.
     * @param $ 
     */
    constructor(name: string, opr: Sym, private readonly id: Rat, $: ExtensionEnv) {
        super(name, opr, $);
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
        if (is_cons(expr) && is_opr(this.opr, expr) && expr.length > 3) {
            const $ = this.$;
            let argList = expr.argList;
            let retval: U = this.id;
            while (is_cons(argList)) {
                retval = makeList(this.opr, retval, argList.car);
                argList = argList.argList;
            }
            return [CHANGED, $.valueOf(retval)];
        }
        return [NOFLAGS, expr];
    }
}

export function associative_explicator(opr: Sym, id: Rat) {
    return new Builder(`Associative explicator for ${opr.key()}`, opr, id);
}

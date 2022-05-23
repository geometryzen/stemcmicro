import { CostTable } from "../../env/CostTable";
import { TFLAG_DIFF, ExtensionEnv, Operator, OperatorBuilder, PHASE_IMPLICATE, TFLAGS } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_cons_atom } from "../../hashing/hash_info";
import { makeList } from "../../makeList";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { is_sym } from "../sym/is_sym";
import { and } from "./and";
import { BCons } from "./BCons";
import { Function2 } from "./Function2";
import { is_any } from "./is_any";

class Builder implements OperatorBuilder<Cons> {
    constructor(private readonly name: string, private readonly opr: Sym) {
        // Nothing to see here.
    }
    create($: ExtensionEnv): Operator<Cons> {
        return new Implicator(this.name, this.opr, $);
    }
}

type LHS = Cons;
type RHS = U;
type EXP = BCons<Sym, LHS, RHS>;

function is_opr(sym: Sym) {
    return function (expr: Cons): expr is Cons {
        const opr = expr.opr;
        if (is_sym(opr)) {
            return sym.equalsSym(opr);
        }
        else {
            return false;
        }
    };
}

/**
 * (op (op a1 a2 a3 ...) b) => (op a1 a2 a3 ... b) 
 */
class Implicator extends Function2<LHS, RHS> implements Operator<EXP> {
    readonly hash: string;
    readonly phases = PHASE_IMPLICATE;
    constructor(name: string, opr: Sym, $: ExtensionEnv) {
        // Ensure that the operator in the lhs operand is the same as the dominant operator symbol...
        super(name, opr, and(is_cons, is_opr(opr)), is_any, $);
        this.hash = hash_binop_cons_atom(opr, opr, HASH_ANY);
    }
    cost(expr: EXP, costTable: CostTable, depth: number): number {
        // The extra cost for '+' proportional to depth is to encourage distribution law over addition expansion.
        return super.cost(expr, costTable, depth) + costTable.getCost(this.opr, this.$) * depth;
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS): [TFLAGS, U] {
        const $ = this.$;
        return [TFLAG_DIFF, $.valueOf(makeList(this.opr, ...lhs.tail(), rhs))];
    }
}

export function associative_implicator(opr: Sym) {
    return new Builder(`implicate ${opr.key()}`, opr);
}

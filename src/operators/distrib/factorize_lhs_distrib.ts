import { CHANGED, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { Sym } from "../../tree/sym/Sym";
import { is_cons, makeList, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2X } from "../helpers/Function2X";
import { is_opr_2_any_any } from "../helpers/is_opr_2_any_any";

type LL = U;
type LR = U;
type LHS = BCons<Sym, LL, LR>;
type RL = U;
type RR = U;
type RHS = BCons<Sym, RL, RR>;
type EXPR = BCons<Sym, LHS, RHS>;

class OpBuilder implements OperatorBuilder<EXPR> {
    constructor(private readonly name: string, private readonly mul: Sym, private readonly add: Sym) {
        // Nothing to see here.
    }
    create($: ExtensionEnv): Operator<EXPR> {
        return new Op(this.name, this.mul, this.add, $);
    }
}

function cross($: ExtensionEnv) {
    return function (lhs: LHS, rhs: RHS): boolean {
        if ($.isFactoring()) {
            const x1 = lhs.lhs;
            const x2 = rhs.lhs;
            if (x1.equals(x2)) {
                return true;
            }
            return false;
        }
        else {
            return false;
        }
    };
}

class Op extends Function2X<LHS, RHS> implements Operator<EXPR> {
    readonly hash: string;
    constructor(public readonly name: string, mul: Sym, add: Sym, $: ExtensionEnv) {
        super(name, add, and(is_cons, is_opr_2_any_any(mul)), and(is_cons, is_opr_2_any_any(mul)), cross($), $);
        this.hash = `(${add.key()} (${mul.key()}) (${mul.key()}))`;
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS): [TFLAGS, U] {
        const $ = this.$;
        const A = lhs.rhs;
        const B = rhs.rhs;
        const X = lhs.lhs;
        const AB = $.valueOf(makeList(opr, A, B));
        return [CHANGED, $.valueOf(makeList(lhs.opr, X, AB))];
    }
}

/**
 * (X * A) + (X * B) => X * (A + B)
 * 
 * @param name The name used for the operator in debugging.
 * @param op1 The operator symbol that plays the role of multiplication.
 * @param op2 The operator symbol that plays the role of addition.
 */
export function factorize_lhs_distrib(name: string, op1: Sym, op2: Sym): OperatorBuilder<EXPR> {
    return new OpBuilder(name, op1, op2);
}

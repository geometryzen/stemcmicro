import { CHANGED, ExtensionEnv, Operator, OperatorBuilder, STABLE, TFLAGS } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_RAT } from "../../hashing/hash_info";
import { pow_rat_rat } from "../../pow_rat_rat";
import { MATH_POW } from "../../runtime/ns_math";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_rat } from "../rat/RatExtension";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LHS = Rat;
type RHS = Rat;
type EXPR = BCons<Sym, LHS, RHS>;

class Op extends Function2<LHS, RHS> implements Operator<EXPR> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('pow_2_rat_rat', MATH_POW, is_rat, is_rat, $);
        this.hash = hash_binop_atom_atom(MATH_POW, HASH_RAT, HASH_RAT);
    }
    isImag(expr: EXPR): boolean {
        return expr.lhs.isMinusOne() && expr.rhs.isHalf();
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isScalar(expr: EXPR): boolean {
        return true;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isVector(expr: EXPR): boolean {
        return false;
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, expr: EXPR): [TFLAGS, U] {
        // const $ = this.$;
        // console.log(`${this.name}  ${print_expr(expr, $)}`);
        const retval = pow_rat_rat(lhs, rhs, this.$);
        return [!retval.equals(expr) ? CHANGED : STABLE, retval];
    }
}

export const pow_2_rat_rat = new Builder();

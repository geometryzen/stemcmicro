import { TFLAG_DIFF, ExtensionEnv, Operator, OperatorBuilder, MODE_EXPANDING, TFLAGS } from "../../env/ExtensionEnv";
import { hash_unaop_cons } from "../../hashing/hash_info";
import { MATH_MUL } from "../../runtime/ns_math";
import { is_rat } from "../rat/is_rat";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { is_cons, items_to_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function1 } from "../helpers/Function1";
import { GUARD } from "../helpers/GUARD";
import { is_any } from "../helpers/is_any";
import { is_opr_2_lhs_rhs } from "../helpers/is_opr_2_lhs_rhs";
import { UCons } from "../helpers/UCons";
import { MATH_STANDARD_PART } from "./MATH_STANDARD_PART";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

type AL = Rat;
type AR = U;
type ARG = BCons<Sym, AL, AR>;
type EXP = UCons<Sym, ARG>;

const guardA: GUARD<U, ARG> = and(is_cons, is_opr_2_lhs_rhs(MATH_MUL, is_rat, is_any));

/**
 * st(k*X) => k*st(X) 
 */
class Op extends Function1<ARG> implements Operator<EXP> {
    readonly #hash: string;
    readonly phases = MODE_EXPANDING;
    constructor($: ExtensionEnv) {
        super('st_mul_2_rat_any', MATH_STANDARD_PART, guardA, $);
        this.#hash = hash_unaop_cons(MATH_STANDARD_PART, MATH_MUL);
    }
    get hash(): string {
        return this.#hash;
    }
    transform1(opr: Sym, arg: ARG): [TFLAGS, U] {
        const $ = this.$;
        const k = arg.lhs;
        const X = arg.rhs;
        const p1 = $.valueOf(items_to_cons(opr, X));
        const p2 = $.valueOf(items_to_cons(arg.opr, k, p1));
        return [TFLAG_DIFF, p2];
    }
}

export const st_mul_2_rat_any = new Builder();

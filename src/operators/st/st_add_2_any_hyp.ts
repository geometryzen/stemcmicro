import { TFLAG_DIFF, ExtensionEnv, Operator, OperatorBuilder, MODE_EXPANDING, TFLAGS } from "../../env/ExtensionEnv";
import { hash_unaop_cons } from "../../hashing/hash_info";
import { MATH_ADD } from "../../runtime/ns_math";
import { Hyp } from "../../tree/hyp/Hyp";
import { Sym } from "../../tree/sym/Sym";
import { is_cons, items_to_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { Cons2 } from "../helpers/Cons2";
import { Function1 } from "../helpers/Function1";
import { GUARD } from "../helpers/GUARD";
import { is_any } from "../helpers/is_any";
import { is_opr_2_lhs_rhs } from "../helpers/is_opr_2_lhs_rhs";
import { Cons1 } from "../helpers/Cons1";
import { is_hyp } from "../hyp/is_hyp";
import { MATH_STANDARD_PART } from "./MATH_STANDARD_PART";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

type AL = U;
type AR = Hyp;
type ARG = Cons2<Sym, AL, AR>;
type EXP = Cons1<Sym, ARG>;

const guardA: GUARD<U, ARG> = and(is_cons, is_opr_2_lhs_rhs(MATH_ADD, is_any, is_hyp));

/**
 * st(a+Hyp) => st(a) 
 */
class Op extends Function1<ARG> implements Operator<EXP> {
    readonly #hash: string;
    readonly phases = MODE_EXPANDING;
    constructor($: ExtensionEnv) {
        super('st_add_2_any_hyp', MATH_STANDARD_PART, guardA, $);
        this.#hash = hash_unaop_cons(MATH_STANDARD_PART, MATH_ADD);
    }
    get hash(): string {
        return this.#hash;
    }
    transform1(opr: Sym, arg: ARG): [TFLAGS, U] {
        const $ = this.$;
        const a = arg.lhs;
        const retval = $.valueOf(items_to_cons(MATH_STANDARD_PART, a));
        return [TFLAG_DIFF, retval];
    }
}

export const st_add_2_any_hyp = new Builder();

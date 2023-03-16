import { ExtensionEnv, MODE_EXPANDING, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_unaop_cons } from "../../hashing/hash_info";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { Sym } from "../../tree/sym/Sym";
import { is_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function1 } from "../helpers/Function1";
import { is_any } from "../helpers/is_any";
import { is_opr_2_lhs_any } from "../helpers/is_opr_2_lhs_any";
import { UCons } from "../helpers/UCons";

export const MATH_ADD = native_sym(Native.add);
export const MATH_SIN = native_sym(Native.sin);

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

type AL = U;
type AR = U;
type ARG = BCons<Sym, AL, AR>;
type EXP = UCons<Sym, ARG>;

/**
 * sin(a+b) => sin(a)*cos(b)+cos(a)*sin(b) 
 */
class Op extends Function1<ARG> implements Operator<EXP> {
    readonly hash: string;
    readonly phases = MODE_EXPANDING;
    constructor($: ExtensionEnv) {
        super('sin_add_2_any_any', MATH_SIN, and(is_cons, is_opr_2_lhs_any(MATH_ADD, is_any)), $);
        this.hash = hash_unaop_cons(MATH_SIN, MATH_ADD);
    }
    transform1(opr: Sym, arg: ARG): [TFLAGS, U] {
        // TODO: Why are we doing this expansion unconditionally?
        // console.lg(this.name, this.$.toInfixString(arg));
        const $ = this.$;
        const a = arg.lhs;
        const b = arg.rhs;
        const sinA = $.sin(a);
        const cosB = $.cos(b);
        const cosA = $.cos(a);
        const sinB = $.sin(b);
        const sacb = $.multiply(sinA, cosB);
        const casb = $.multiply(cosA, sinB);
        const retval = $.add(sacb, casb);
        return [TFLAG_DIFF, retval];
    }
}

export const sin_add_2_any_any = new Builder();

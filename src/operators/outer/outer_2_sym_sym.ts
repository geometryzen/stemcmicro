
import { ExtensionEnv, FEATURE, Operator, OperatorBuilder, TFLAGS, TFLAG_HALT } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_SYM } from "../../hashing/hash_info";
import { MATH_OUTER } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_sym } from "../sym/is_sym";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

class Op extends Function2<Sym, Sym> implements Operator<BCons<Sym, Sym, Sym>> {
    readonly hash: string;
    readonly dependencies: FEATURE[] = ['Vector'];
    constructor($: ExtensionEnv) {
        super('outer_2_sym_sym', MATH_OUTER, is_sym, is_sym, $);
        this.hash = hash_binop_atom_atom(MATH_OUTER, HASH_SYM, HASH_SYM);
    }
    transform2(opr: Sym, lhs: Sym, rhs: Sym, expr: BCons<Sym, Sym, Sym>): [TFLAGS, U] {
        const $ = this.$;
        if ($.treatAsScalar(lhs)) {
            if ($.treatAsScalar(rhs)) {
                // scalar ^ scalar
                return [TFLAG_HALT, expr];
            }
            else {
                // scalar ^ other
                return [TFLAG_HALT, expr];
            }
        }
        else {
            if ($.treatAsScalar(rhs)) {
                // other ^ scalar
                return [TFLAG_HALT, expr];
            }
            else {
                // other ^ other
                return [TFLAG_HALT, expr];
            }
        }
    }
}

export const outer_2_sym_sym = new Builder();

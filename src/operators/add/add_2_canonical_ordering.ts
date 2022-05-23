import { compare_terms } from "../../calculators/compare/compare_terms";
import { TFLAG_DIFF, ExtensionEnv, FEATURE, Operator, OperatorBuilder, PHASE_FLAGS_EXPANDING_UNION_FACTORING, TFLAGS } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_atom_atom } from "../../hashing/hash_info";
import { makeList } from "../../makeList";
import { MATH_ADD } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { Function2X } from "../helpers/Function2X";
import { is_any } from "../helpers/is_any";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LHS = U;
type RHS = U;
type EXP = BCons<Sym, LHS, RHS>;

function cross($: ExtensionEnv) {
    return function (lhs: LHS, rhs: RHS): boolean {
        // console.log(`compareTerms lhs=${print_expr(lhs, $)}, rhs=${print_expr(rhs, $)}`);
        return compare_terms(lhs, rhs, $) > 0;
    };
}

/**
 * b + a => a + b
 */
class Op extends Function2X<LHS, RHS> implements Operator<EXP> {
    readonly hash: string;
    readonly phases = PHASE_FLAGS_EXPANDING_UNION_FACTORING;
    // Because we make use of generic term comparison, we require a bunch of features.
    readonly dependencies: FEATURE[] = ['Blade', 'Flt', 'Imu', 'Uom', 'Vector'];
    constructor($: ExtensionEnv) {
        super('add_2_canonical_ordering', MATH_ADD, is_any, is_any, cross($), $);
        this.hash = hash_binop_atom_atom(MATH_ADD, HASH_ANY, HASH_ANY);
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS): [TFLAGS, U] {
        return [TFLAG_DIFF, this.$.valueOf(makeList(opr, rhs, lhs))];
    }
}

export const add_2_canonical_ordering = new Builder();

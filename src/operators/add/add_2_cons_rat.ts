
import { compare_terms } from "../../calculators/compare/compare_terms";
import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_atom_atom, HASH_RAT } from "../../hashing/hash_info";
import { makeList } from "../../makeList";
import { MATH_ADD } from "../../runtime/ns_math";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_rat } from "../rat/is_rat";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LHS = Cons;
type RHS = Rat;
type EXP = BCons<Sym, LHS, RHS>;

/**
 * TODO: add_2_canonical_ordering is similar.
 */
class Op extends Function2<LHS, RHS> implements Operator<EXP> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('add_2_cons_rat', MATH_ADD, is_cons, is_rat, $);
        // IMPROVE: Not a very precise hash...
        this.hash = hash_binop_atom_atom(MATH_ADD, HASH_ANY, HASH_RAT);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform2(opr: Sym, lhs: LHS, rhs: RHS, exp: EXP): [TFLAGS, U] {
        // console.log(`${this.name} exp=${exp}`);
        if (rhs.isZero()) {
            return [TFLAG_DIFF, lhs];
        }
        else {
            const $ = this.$;
            // Prevent looping by making the reordering conditional. 
            const sign = compare_terms(lhs, rhs, $);
            if (sign > 0) {
                return [TFLAG_DIFF, $.valueOf(makeList(opr, rhs, lhs))];
            }
            else {
                return [TFLAG_NONE, exp];
            }
        }
    }
}

export const add_2_cons_rat = new Builder();

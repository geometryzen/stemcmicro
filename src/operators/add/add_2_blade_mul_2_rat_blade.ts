import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, Operator, OperatorBuilder, SIGN_EQ, SIGN_GT, TFLAGS, TFLAG_DIFF, TFLAG_HALT, TFLAG_NONE } from "../../env/ExtensionEnv";
import { hash_binop_atom_cons, HASH_BLADE } from "../../hashing/hash_info";
import { MATH_ADD, MATH_MUL } from "../../runtime/ns_math";
import { Rat, zero } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, items_to_cons, U } from "../../tree/tree";
import { Blade } from "../../tree/vec/Blade";
import { compare_blade_blade } from "../blade/blade_extension";
import { is_blade } from "../blade/is_blade";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_mul_2_rat_blade } from "../mul/is_mul_2_rat_blade";

class Builder implements OperatorBuilder<Cons> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    create($: ExtensionEnv, config: Readonly<EnvConfig>): Operator<Cons> {
        return new Op($, config);
    }
}

type LHS = Blade;
type RL = Rat;
type RR = Blade;
type RHS = BCons<Sym, RL, RR>;
type EXP = BCons<Sym, LHS, RHS>

class Op extends Function2<LHS, RHS> implements Operator<EXP> {
    readonly hash: string;
    constructor($: ExtensionEnv, private readonly config: EnvConfig) {
        super('add_2_blade_mul_2_rat_blade', MATH_ADD, is_blade, and(is_cons, is_mul_2_rat_blade), $);
        this.hash = hash_binop_atom_cons(MATH_ADD, HASH_BLADE, MATH_MUL);
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, expr: EXP): [TFLAGS, U] {
        const $ = this.$;
        // console.lg(this.name, decodeMode($.getMode()), render_as_infix(expr, $));
        if (this.config.noOptimize) {
            return [TFLAG_NONE, expr];
        }
        if ($.isExpanding()) {
            switch (compare_blade_blade(lhs, rhs.rhs)) {
                case SIGN_GT: {
                    return [TFLAG_DIFF, items_to_cons(opr, rhs, lhs)];
                }
                case SIGN_EQ: {
                    const sum = rhs.lhs.succ();
                    if (sum.isZero()) {
                        return [TFLAG_DIFF, zero];
                    }
                    if (sum.isOne()) {
                        return [TFLAG_DIFF, lhs];
                    }
                    return [TFLAG_DIFF, items_to_cons(rhs.opr, sum, lhs)];
                }
                default: {
                    return [TFLAG_HALT, expr];
                }
            }
        }
        else {
            return [TFLAG_NONE, expr];
        }
    }
}

export const add_2_blade_mul_2_rat_blade = new Builder();
